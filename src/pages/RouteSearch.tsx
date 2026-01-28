import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Separator } from "../components/ui/separator";
import AppContext from "../context/AppContext";
import AddressInput, { Address } from "../components/route-search/AddressInput";
import SearchMap from "../components/route-search/SearchMap";
import { fetchEtas, Eta, Company, Location } from "hk-bus-eta";
import { setSeoHeader, getDistance, vibrate } from "../utils";
import SearchResultList from "../components/route-search/SearchResultList";
import useLanguage from "../hooks/useTranslation";
import DbContext from "../context/DbContext";
import { cn } from "../lib/utils";

export interface SearchRoute {
  routeId: string;
  on: number;
  off: number;
}

interface RouteSearchState {
  locations: {
    start: Address | null;
    end: Address | null;
  };
  status: "ready" | "rendering" | "waiting";
  result: Array<{ routeId: string; on: number; off: number }[]>;
  resultIdx: {
    resultIdx: number;
    stopIdx: number[];
  };
}

const RouteSearch = () => {
  const { t } = useTranslation();
  const language = useLanguage();
  const {
    AppTitle,
    db: { routeList, stopList, holidays, serviceDayMap },
  } = useContext(DbContext);
  const { geolocation, energyMode, vibrateDuration } = useContext(AppContext);

  const [state, setState] = useState<RouteSearchState>(DEFAULT_STATE);
  const { locations, status, result, resultIdx } = state;

  const worker = useRef<Worker | null>(null);
  const terminateWorker = () => {
    if (worker.current) {
      worker.current.terminate();
      worker.current = null;
    }
  };

  const updateRoutes = useCallback(
    (routeResults: Array<SearchRoute[]>, startLocation: Location) => {
      const uniqueRoutes = routeResults
        .reduce(
          (acc, routeArr) =>
            acc.concat(
              ...routeArr.map((r) => [
                `${r.routeId}/${r.on}`,
                `${r.routeId}/${r.off}`,
              ])
            ),
          [] as string[]
        )
        .filter((v, i, s) => s.indexOf(v) === i);

      Promise.all(
        uniqueRoutes.map((routeIdSeq): Promise<Eta[]> => {
          const [routeId, seq] = routeIdSeq.split("/");
          return !navigator.onLine
            ? new Promise((resolve) => resolve([]))
            : fetchEtas({
                ...routeList[routeId],
                seq: parseInt(seq, 10),
                co: Object.keys(routeList[routeId].stops) as Company[],
                language: language as "en" | "zh",
                stopList,
                serviceDayMap,
                holidays,
              }).then((p) => p.filter((e) => e.eta));
        })
      )
        .then((etas) =>
          uniqueRoutes.filter(
            (_, idx) =>
              !navigator.onLine ||
              (etas[idx].length &&
                etas[idx].reduce((acc, eta) => Boolean(acc || eta.eta), false))
          )
        )
        .then((availableRoutes) => {
          setState((prev) => ({
            ...prev,
            result: [
              ...prev.result,
              ...routeResults
                .filter((routes) =>
                  routes.reduce((ret, route) => {
                    return (
                      ret &&
                      (availableRoutes.indexOf(
                        `${route.routeId}/${route.on}`
                      ) !== -1 ||
                        availableRoutes.indexOf(
                          `${route.routeId}/${route.off}`
                        ) !== -1)
                    );
                  }, true)
                )
                .map((routes) => {
                  let start = startLocation;
                  return routes.map((route) => {
                    const stops = Object.values(
                      routeList[route.routeId].stops
                    ).sort((a, b) => b.length - a.length)[0];
                    let bestOn = -1;
                    let dist = 100000;
                    for (let i = route.on; i < route.off; ++i) {
                      let _dist = getDistance(
                        stopList[stops[i]].location,
                        start
                      );
                      if (_dist < dist) {
                        bestOn = i;
                        dist = _dist;
                      }
                    }
                    start = stopList[stops[route.off]].location;
                    return {
                      ...route,
                      on: bestOn,
                    };
                  });
                })
                .map((routes): [SearchRoute[], number] => [
                  routes,
                  routes.reduce((sum, route) => sum + route.off - route.on, 0),
                ])
                .sort((a, b) => a[1] - b[1])
                .map((v) => v[0]),
            ],
          }));
        });
    },
    [holidays, language, routeList, serviceDayMap, stopList]
  );

  useEffect(() => {
    setSeoHeader({
      title: t("點對點路線搜尋") + " - " + t(AppTitle),
      description: t("route-search-page-description"),
      lang: language,
    });
  }, [language, t, AppTitle]);

  useEffect(() => {
    if (status === "rendering") {
      setState((prev) => ({ ...prev, status: "ready" }));
    }
  }, [status, result]);

  useEffect(() => {
    if (status === "waiting" && locations.end) {
      if (window.Worker) {
        terminateWorker();
        const startLocation = locations.start
          ? locations.start.location
          : geolocation.current;
        worker.current = new Worker("/search-worker.js");
        worker.current.postMessage({
          routeList,
          stopList,
          start: startLocation,
          end: locations.end.location,
          maxDepth: 2,
        });
        worker.current.onmessage = (e) => {
          if (e.data.type === "done") {
            terminateWorker();
            setState((prev) => ({
              ...prev,
              status: e.data.count ? "rendering" : "ready",
            }));
            return;
          }
          updateRoutes(
            e.data.value.sort(
              (a: SearchRoute[], b: SearchRoute[]) => a.length - b.length
            ),
            startLocation
          );
        };
      }
    }

    return () => {
      terminateWorker();
    };
  }, [status, locations, geolocation, routeList, stopList, updateRoutes]);

  const handleStartChange = useCallback((address: Address | null) => {
    setState((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        start: address,
      },
      status: "waiting",
      resultIdx: {
        resultIdx: 0,
        stopIdx: [0, 0],
      },
      result: [],
    }));
  }, []);

  const handleEndChange = useCallback((address: Address | null) => {
    setState((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        end: address,
      },
      status: address ? "waiting" : prev.status,
      resultIdx: {
        resultIdx: 0,
        stopIdx: [0, 0],
      },
      result: [],
    }));
  }, []);

  const handleRouteClick = useCallback(
    (idx: number) => {
      vibrate(vibrateDuration);
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          resultIdx: { resultIdx: idx, stopIdx: [0, 0] },
        }));
      }, 0);
    },
    [vibrateDuration]
  );

  const handleMarkerClick = useCallback(
    (routeId: string, offset: number) => {
      const routeIdx = result[resultIdx.resultIdx]
        .map((route) => route.routeId)
        .indexOf(routeId);
      setState((prev) => {
        const _stopIdx = [...prev.resultIdx.stopIdx];
        _stopIdx[routeIdx] = offset;
        return {
          ...prev,
          resultIdx: {
            ...prev.resultIdx,
            stopIdx: _stopIdx,
          },
        };
      });
    },
    [result, resultIdx]
  );

  const handleReverseClick = useCallback(() => {
    setState((prev) => {
      return {
        ...prev,
        locations: {
          start: prev.locations.end,
          end: prev.locations.start,
        },
        status: "waiting",
        resultIdx: {
          resultIdx: 0,
          stopIdx: [0, 0],
        },
        result: [],
      };
    });
  }, []);

  return (
    <div className="w-full h-full bg-background overflow-hidden text-left">
      {!energyMode ? (
        <SearchMap
          start={
            locations.start ? locations.start.location : geolocation.current
          }
          end={locations.end ? locations.end.location : null}
          routes={result[resultIdx.resultIdx]}
          stopIdx={resultIdx.stopIdx}
          onMarkerClick={handleMarkerClick}
        />
      ) : null}
      <div className="flex flex-row mt-[2%] px-[2%]">
        <div className="flex flex-col w-full">
          <AddressInput
            value={locations.start}
            placeholder={t("你的位置")}
            onChange={handleStartChange}
            stopList={stopList}
          />
          <AddressInput
            value={locations.end}
            placeholder={t("目的地")}
            onChange={handleEndChange}
            stopList={stopList}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReverseClick}
          className="min-w-[24px]"
        >
          <ArrowUpDown className="h-5 w-5" />
        </Button>
      </div>
      <div
        className={cn(
          "overflow-y-auto",
          !energyMode ? "h-[calc(100%-30vh-76px)]" : "h-[calc(100%-76px)]"
        )}
      >
        {!locations.end ? (
          <RouteSearchDetails />
        ) : "waiting|rendering".includes(status) && result.length === 0 ? (
          <div className="w-full">
            <div className="h-1 w-full bg-muted overflow-hidden">
              <div className="h-full bg-primary animate-[loading_1s_ease-in-out_infinite] w-1/3" />
            </div>
          </div>
        ) : "ready|waiting|rendering".includes(status) && result.length ? (
          <div className="flex flex-col gap-1">
            {result.map((routes, resIdx) => (
              <SearchResultList
                key={`search-result-${resIdx}`}
                routes={routes}
                idx={resIdx}
                handleRouteClick={handleRouteClick}
                expanded={resIdx === resultIdx.resultIdx}
                stopIdx={
                  resIdx === resultIdx.resultIdx ? resultIdx.stopIdx : null
                }
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">{t("找不到合適的巴士路線")}</div>
        )}
      </div>
    </div>
  );
};

const RouteSearchDetails = () => {
  const { t } = useTranslation();
  return (
    <div className="text-left mt-[5%] p-[5%]">
      <h5 className="text-lg font-semibold mb-2">{t("Route Search header")}</h5>
      <Separator className="my-2" />
      <p className="text-base font-medium mb-4">
        {t("Route Search description")}
      </p>
      <p className="text-sm text-muted-foreground mb-1">
        {t("Route Search constraint")}
      </p>
      <p className="text-sm text-muted-foreground mb-1">
        1. {t("Route Search caption 1")}
      </p>
      <p className="text-sm text-muted-foreground mb-1">
        2. {t("Route Search caption 2")}
      </p>
      <p className="text-sm text-muted-foreground">
        3. {t("Route Search caption 3")}
      </p>
    </div>
  );
};

export default RouteSearch;

const DEFAULT_STATE: RouteSearchState = {
  locations: {
    start: null,
    end: null,
  },
  status: "ready",
  result: [],
  resultIdx: {
    resultIdx: 0,
    stopIdx: [0, 0],
  },
};
