import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import RouteNo from "../route-board/RouteNo";
import TimeReport from "../route-eta/TimeReport";
import useLanguage from "../../hooks/useTranslation";
import { SearchRoute } from "../../pages/RouteSearch";
import DbContext from "../../context/DbContext";

interface SearchResultListProps {
  routes: SearchRoute[];
  idx: number;
  handleRouteClick: (idx: number) => void;
  expanded: boolean;
  stopIdx: number[] | null;
}

const SearchResultList = ({
  routes,
  idx,
  handleRouteClick,
  expanded,
  stopIdx,
}: SearchResultListProps) => {
  const {
    db: { routeList, stopList },
  } = useContext(DbContext);
  const { t } = useTranslation();
  const language = useLanguage();

  const getStopString = useCallback(
    (routes: SearchRoute[]) => {
      const ret: string[] = [];
      routes.forEach((selectedRoute) => {
        const { routeId, on } = selectedRoute;
        const { fares, stops } = routeList[routeId];
        ret.push(
          stopList[
            Object.values(stops).sort((a, b) => b.length - a.length)[0][on]
          ].name[language] + (fares ? ` ($${fares[on]})` : "")
        );
      });
      const { routeId, off } = routes[routes.length - 1];
      const { stops } = routeList[routeId];
      return ret
        .concat(
          stopList[
            Object.values(stops).sort((a, b) => b.length - a.length)[0][off]
          ].name[language]
        )
        .join(" → ");
    },
    [routeList, language, stopList]
  );

  return (
    <Accordion
      type="single"
      collapsible
      value={expanded ? `item-${idx}` : ""}
      onValueChange={(value) => {
        if (value === `item-${idx}`) {
          handleRouteClick(idx);
        } else if (expanded) {
          handleRouteClick(idx);
        }
      }}
    >
      <AccordionItem value={`item-${idx}`} className="border border-border">
        <AccordionTrigger className="px-4 py-2 bg-muted/30 hover:bg-muted/50 data-[state=open]:border-b border-border">
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-wrap gap-1">
              {routes.map((selectedRoute, routeIdx) => {
                const { routeId } = selectedRoute;
                const { route, serviceType } = routeList[routeId];

                return (
                  <span
                    key={`search-${idx}-${routeIdx}`}
                    className="inline-flex items-center"
                  >
                    <RouteNo routeNo={route} />
                    {parseInt(serviceType, 10) >= 2 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        {t("特別班")}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            <span className="text-sm text-muted-foreground mt-1">
              {getStopString(routes)}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {routes.map((selectedRoute, routeIdx) => (
              <TimeReport
                key={`timereport-${idx}-${routeIdx}`}
                routeId={selectedRoute.routeId.toUpperCase()}
                seq={selectedRoute.on + (stopIdx ? stopIdx[routeIdx] : 0)}
                className="w-[50%]"
                showStopName={true}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SearchResultList;
