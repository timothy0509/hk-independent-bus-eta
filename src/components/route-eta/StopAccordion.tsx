import React, { useContext, useCallback, useMemo } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import {
  BellPlus as NotificationAddIcon,
  BellOff as NotificationsOffIcon,
  Star as StarIcon,
  StarOff as StarBorderIcon,
  Info as InfoIcon,
  Share as ShareIcon,
  Pin as PushPinIcon,
  PinOff as PushPinOutlinedIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toProperCase } from "../../utils";
import TimeReport from "./TimeReport";
import { SharingModalProps } from "./SharingModal";
import ReactNativeContext from "../../context/ReactNativeContext";
import useLanguage from "../../hooks/useTranslation";
import DbContext from "../../context/DbContext";
import CollectionContext from "../../CollectionContext";
import PinnedEtasContext from "../../context/PinnedEtasContext";
import { Typography } from "../ui/Typography";

interface StopAccordionProps {
  routeId: string;
  stopId: string;
  stopIdx: number;
  idx: number;
  onShareClick: (obj: SharingModalProps) => void;
  onStopInfoClick: () => void;
  onSummaryClick: (idx: number, expand: boolean) => void;
}

const StopAccordion = React.forwardRef<HTMLDetailsElement, StopAccordionProps>(
  (props, ref) => {
    const {
      routeId,
      stopId,
      stopIdx,
      idx,
      onShareClick,
      onSummaryClick,
      onStopInfoClick,
    } = props;
    const {
      db: { routeList, stopList },
    } = useContext(DbContext);
    const { savedEtas, setCollectionDrawerRoute, collections } =
      useContext(CollectionContext);
    const { alarmStopId, toggleStopAlarm } = useContext(ReactNativeContext);
    const { isStopAlarm } = useContext(ReactNativeContext);
    const { pinnedEtas, togglePinnedEta } = useContext(PinnedEtasContext);
    const { t } = useTranslation();
    const language = useLanguage();
    const { fares, faresHoliday } = routeList[routeId];
    const stop = stopList[stopId];
    const targetRouteId = `${routeId.toUpperCase()}/${idx}`;
    const isStarred = useMemo<boolean>(
      () =>
        savedEtas.includes(targetRouteId) ||
        collections.reduce(
          (acc, cur) => acc || cur.list.includes(targetRouteId),
          false
        ),
      [savedEtas, targetRouteId, collections]
    );

    const handleShareClick = useCallback(
      (e: React.MouseEvent) => {
        onShareClick({
          routeId,
          seq: idx,
          stopId,
          event: e,
        });
      },
      [onShareClick, routeId, idx, stopId]
    );

    const handleChangeInner = useCallback(
      (_: unknown, expand: boolean) => {
        onSummaryClick(idx, expand);
      },
      [idx, onSummaryClick]
    );

    return (
      <details
        id={`stop-${idx}`}
        open={stopIdx === idx && navigator.userAgent !== "prerendering"}
        className="border border-border shadow-none [&:not(:last-child)]:border-b-0 [&:before]:hidden"
        onToggle={(e) => {
          const isOpen = (e.target as HTMLDetailsElement).open;
          handleChangeInner(null, isOpen);
        }}
        ref={ref}
      >
        <summary className="bg-muted/3 dark:bg-muted/10 min-h-[44px] flex flex-col gap-2 px-4 py-4 cursor-pointer list-none [&::webkit-details-marker]:hidden data-[state=open]:border-b border-border">
          <Typography component="h3" variant="body1" className="font-bold">
            {idx + 1}. {toProperCase(stop.name[language])}
          </Typography>
          <Typography variant="body2">
            {fares && fares[idx] ? t("車費") + ": $" + fares[idx] : ""}
            {faresHoliday && faresHoliday[idx]
              ? "　　　　" + t("假日車費") + ": $" + faresHoliday[idx]
              : ""}
          </Typography>
        </summary>
        <div className="flex items-center pl-2 pr-1 py-1 justify-between">
          <div className="flex-1">
            <TimeReport
              className="flex-1"
              routeId={`${routeId.toUpperCase()}`}
              seq={idx}
            />
          </div>
          <div className="flex flex-col items-end">
            <div>
              {isStopAlarm && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="alert"
                  onClick={() => toggleStopAlarm(stopId)}
                  className="bg-transparent"
                >
                  <Icon
                    icon={
                      alarmStopId === stopId
                        ? NotificationsOffIcon
                        : NotificationAddIcon
                    }
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label="stop-info"
                onClick={onStopInfoClick}
                className="bg-transparent"
              >
                <Icon icon={InfoIcon} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="pin"
                onClick={() => togglePinnedEta(targetRouteId)}
                className="bg-transparent"
              >
                <Icon
                  icon={
                    pinnedEtas.includes(targetRouteId)
                      ? PushPinIcon
                      : PushPinOutlinedIcon
                  }
                />
              </Button>
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="share"
                onClick={handleShareClick}
                className="bg-transparent"
              >
                <Icon icon={ShareIcon} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="favourite"
                onClick={() => {
                  setCollectionDrawerRoute(targetRouteId);
                }}
                className="bg-transparent dark:text-primary text-inherit"
              >
                <Icon icon={isStarred ? StarIcon : StarBorderIcon} />
              </Button>
            </div>
          </div>
        </div>
      </details>
    );
  }
);

export default StopAccordion;
