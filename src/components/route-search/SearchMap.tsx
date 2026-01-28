import { useCallback, useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, useMap } from "react-leaflet";
import Leaflet, { LatLngExpression } from "leaflet";
import AppContext from "../../context/AppContext";
import { checkPosition } from "../../utils";
import { Location as GeoLocation } from "hk-bus-eta";
import SelfCircle from "../map/SelfCircle";
import CompassControl from "../map/CompassControl";
import useLanguage from "../../hooks/useTranslation";
import { SearchRoute } from "../../pages/RouteSearch";
import DbContext from "../../context/DbContext";
import CenterControl from "../map/CenterControl";
import BaseTile from "../map/BaseTile";
import { cn } from "../../lib/utils";

interface ChangeMapCenter {
  center: GeoLocation | null;
  start: GeoLocation;
  end: GeoLocation | null;
}

const ChangeMapCenter = ({ center, start, end }: ChangeMapCenter) => {
  const map = useMap();
  if (center) map.flyTo(checkPosition(center));
  else if (end)
    map.fitBounds(
      Leaflet.latLngBounds(
        Leaflet.latLng(start.lat, start.lng),
        Leaflet.latLng(end.lat, end.lng)
      )
    );
  return <></>;
};

const StartMarker = ({ start }: { start: GeoLocation }) => {
  if (start) {
    return <Marker position={start} icon={EndsMarker({ isStart: true })} />;
  }
  return null;
};

const EndMarker = ({ end }: { end: GeoLocation | null }) => {
  if (end) {
    return <Marker position={end} icon={EndsMarker({ isStart: false })} />;
  }
  return null;
};

interface BusRouteProps {
  route: SearchRoute;
  lv: number;
  stopIdx: number;
  onMarkerClick: (routeId: string, offset: number) => void;
}

const BusRoute = ({
  route: { routeId, on, off },
  lv,
  stopIdx,
  onMarkerClick,
}: BusRouteProps) => {
  const {
    db: { routeList, stopList },
  } = useContext(DbContext);
  const language = useLanguage();
  const stops = Object.values(routeList[routeId].stops)
    .sort((a, b) => b.length - a.length)[0]
    .slice(on, off + 1);
  const routeNo = routeId.split("-")[0];

  return (
    <>
      {stops.map((stopId, idx) => (
        <Marker
          key={`${stopId}-${idx}`}
          position={stopList[stopId].location}
          icon={BusStopMarker({
            active: stopIdx === idx,
            passed: idx < stopIdx,
            lv,
          })}
          alt={`${idx}. ${routeNo} - ${stopList[stopId].name[language]}`}
          eventHandlers={{
            click: () => {
              onMarkerClick(routeId, idx);
            },
          }}
        />
      ))}
      {stops.slice(1).map((stopId, idx) => (
        <Polyline
          key={`${stopId}-line`}
          positions={[
            getPoint(stopList[stops[idx]].location),
            getPoint(stopList[stopId].location),
          ]}
          color={lv === 0 ? "#FF9090" : "#d0b708"}
        />
      ))}
    </>
  );
};

interface WalklinesProps {
  routes: SearchRoute[];
  start: GeoLocation | null;
  end: GeoLocation | null;
}

const Walklines = ({ routes, start, end }: WalklinesProps) => {
  const {
    db: { routeList, stopList },
  } = useContext(DbContext);
  const lines = [];
  const points = [];

  if (!(start && end)) return <></>;

  points.push(start);
  (routes || []).forEach(({ routeId, on, off }) => {
    const stops = Object.values(routeList[routeId].stops).sort(
      (a, b) => b.length - a.length
    )[0];
    points.push(stopList[stops[on]].location);
    points.push(stopList[stops[off]].location);
  });
  points.push(end || start);
  for (let i = 0; i < points.length / 2; ++i) {
    lines.push([points[i * 2], points[i * 2 + 1]]);
  }

  return (
    <>
      {lines.map((line, idx) => (
        <Polyline
          key={`line-${idx}`}
          positions={[getPoint(line[0]), getPoint(line[1])]}
          color={"green"}
        />
      ))}
    </>
  );
};

interface SearchMapProps {
  routes: SearchRoute[];
  start: GeoLocation;
  end: GeoLocation | null;
  stopIdx: number[] | null;
  onMarkerClick: (routeId: string, offset: number) => void;
}

const SearchMap = ({
  routes,
  start,
  end,
  stopIdx,
  onMarkerClick,
}: SearchMapProps) => {
  const { geolocation, geoPermission, updateGeoPermission } =
    useContext(AppContext);
  const [mapState, setMapState] = useState<{
    center: GeoLocation | null;
    isFollow: boolean;
  }>({
    center: null,
    isFollow: false,
  });
  const { center, isFollow } = mapState;
  const [map, setMap] = useState<Leaflet.Map | null>(null);

  const updateCenter = useCallback(
    (state?: { center?: GeoLocation; isFollow?: boolean }) => {
      const { center, isFollow } = state ?? {};
      setMapState({
        center: center || map?.getCenter() || null,
        isFollow: isFollow || false,
      });
    },
    [map, setMapState]
  );

  const getMapCenter = () => {
    if (center) return center;

    if (start && end) {
      return {
        lat: (start.lat + end.lat) / 2,
        lng: (start.lng + end.lng) / 2,
      };
    }
    return checkPosition(start);
  };

  useEffect(() => {
    if (map) {
      const dragCallback = () => {
        updateCenter({
          center: map.getCenter(),
        });
      };

      map.on({
        dragend: dragCallback,
      });
      return () => {
        map.off({
          dragend: dragCallback,
        });
      };
    }
  }, [map, updateCenter]);

  useEffect(() => {
    if (isFollow) {
      if (
        !center ||
        geolocation.current.lat !== center.lat ||
        geolocation.current.lng !== center.lng
      )
        updateCenter({ center: geolocation.current, isFollow: true });
    }
  }, [geolocation, center, isFollow, updateCenter]);

  return (
    <div className={cn("h-[35vh] w-full", "dark:brightness-[0.8]")}>
      <MapContainer
        center={getMapCenter()}
        zoom={16}
        scrollWheelZoom={false}
        className="h-[35vh] w-full"
        ref={setMap}
      >
        <ChangeMapCenter
          center={center}
          start={checkPosition(start)}
          end={end}
        />
        <BaseTile />
        {stopIdx !== null &&
          (routes || []).map((route, idx) => (
            <BusRoute
              key={`route-${idx}`}
              route={route}
              lv={idx}
              stopIdx={stopIdx[idx]}
              onMarkerClick={onMarkerClick}
            />
          ))}
        <Walklines routes={routes} start={start} end={end} />
        <SelfCircle />
        <StartMarker start={start} />
        <EndMarker end={end} />
        <CenterControl
          onClick={() => {
            if (geoPermission === "granted") {
              updateCenter({ isFollow: true });
            } else if (geoPermission !== "denied") {
              updateCenter({ isFollow: true });
              updateGeoPermission("opening");
            }
          }}
        />
        <CompassControl />
      </MapContainer>
    </div>
  );
};

export default SearchMap;

const getPoint = ({ lat, lng }: GeoLocation): LatLngExpression => [lat, lng];

interface BusStopMarkerProps {
  active: boolean;
  passed: boolean;
  lv: number;
}

const BusStopMarker = ({ active, passed, lv }: BusStopMarkerProps) => {
  return Leaflet.icon({
    iconSize: [24, 40],
    iconAnchor: [12, 40],
    iconUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon-2x.png",
    className: cn(
      "w-10 h-10 z-[618] outline-none",
      lv === 1 && "hue-rotate-[210deg] brightness-150",
      active && "animate-pulse",
      passed && "grayscale"
    ),
  });
};

const EndsMarker = ({ isStart }: { isStart: boolean }) => {
  return Leaflet.icon({
    iconSize: [24, 40],
    iconAnchor: [12, 40],
    iconUrl: "https://unpkg.com/leaflet@1.0.1/dist/images/marker-icon-2x.png",
    className: cn(
      "w-10 h-10 z-[618] outline-none",
      isStart ? "hue-rotate-[30deg]" : "hue-rotate-[280deg]"
    ),
  });
};
