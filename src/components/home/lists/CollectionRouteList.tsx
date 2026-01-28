import { Box } from "../../ui/box";
import { Typography } from "../../ui/Typography";
import { useTranslation } from "react-i18next";
import SuccinctTimeReport from "../SuccinctTimeReport";
import { EtaDb, Location, RouteList, StopList } from "hk-bus-eta";
import { formatHandling } from "../../../utils";
import { useContext, useMemo } from "react";
import AppContext from "../../../context/AppContext";
import { RouteCollection } from "../../../@types/types";
import DbContext from "../../../context/DbContext";

interface CollectionRouteListProps {
  collection: RouteCollection;
  isFocus: boolean;
}

const CollectionRouteList = ({
  collection,
  isFocus,
}: CollectionRouteListProps) => {
  const { t } = useTranslation();
  const { geolocation, isRouteFilter } = useContext(AppContext);
  const {
    db: { routeList, stopList, serviceDayMap },
    isTodayHoliday,
  } = useContext(DbContext);

  const routes = useMemo(
    () =>
      getRoutes({
        savedEtas: collection.list,
        geolocation: geolocation.current,
        stopList,
        routeList,
        isRouteFilter,
        isTodayHoliday,
        serviceDayMap,
      }),
    [
      collection,
      geolocation,
      stopList,
      routeList,
      isRouteFilter,
      isTodayHoliday,
      serviceDayMap,
    ]
  );

  const noRoutes = useMemo(() => routes.every((routeId) => !routeId), [routes]);

  if (!isFocus) {
    return <></>;
  }

  if (noRoutes) {
    return (
      <Box className="flex flex-col gap-2 flex-1 min-h-[100dvh]">
        <Typography className="mt-5 font-bold">
          <b>{t("收藏中未有路線")}</b>
        </Typography>
      </Box>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      {routes.map(
        (selectedRoute, idx) =>
          Boolean(selectedRoute) && (
            <SuccinctTimeReport
              key={`route-shortcut-${idx}`}
              routeId={selectedRoute}
            />
          )
      )}
    </div>
  );
};

export default CollectionRouteList;

const getRoutes = ({
  savedEtas,
  geolocation,
  stopList,
  routeList,
  isRouteFilter,
  isTodayHoliday,
  serviceDayMap,
}: {
  savedEtas: string[];
  geolocation: Location;
  stopList: StopList;
  routeList: RouteList;
  isRouteFilter: boolean;
  isTodayHoliday: boolean;
  serviceDayMap: EtaDb["serviceDayMap"];
}): string[] =>
  formatHandling(
    savedEtas,
    isTodayHoliday,
    isRouteFilter,
    routeList,
    stopList,
    serviceDayMap,
    geolocation
  ).split("|");
