import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "../../context/AppContext";
import { useEtas } from "../../hooks/useEtas";
import { LinearProgress } from "../Progress";
import { Eta, Terminal } from "hk-bus-eta";
import { getPlatformSymbol, getLineColor } from "../../utils";
import useLanguage from "../../hooks/useTranslation";
import DbContext from "../../context/DbContext";
import { DoubleTrainIcon, SingleTrainIcon } from "../home/SuccinctEtas";
import { Box } from "../ui/box";
import { Typography } from "../ui/Typography";
import { cn } from "../../lib/utils";

interface TimeReportProps {
  routeId: string;
  seq: number;
  className?: string;
  showStopName?: boolean;
}

const TimeReport = ({
  routeId,
  seq,
  className,
  showStopName = false,
}: TimeReportProps) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const {
    db: { routeList, stopList },
  } = useContext(DbContext);
  const etas = useEtas(`${routeId}/${seq}`);

  const { route, co, stops } = routeList[routeId];
  const stopId = Object.values(stops)[0][seq];
  const routeDests = useMemo(
    () =>
      Object.values(routeList[routeId].stops)
        .map((ids) => stopList[ids[ids.length - 1]].name)
        .concat(routeList[routeId].dest),
    [routeList, routeId, stopList]
  );

  const noScheduleRemark = useMemo(() => {
    let isEndOfTrainLine = false;
    if (co[0] === "mtr") {
      isEndOfTrainLine =
        stops["mtr"].indexOf(stopId) + 1 >= stops["mtr"].length;
    } else if (co.includes("lightRail")) {
      isEndOfTrainLine =
        stops["lightRail"].indexOf(stopId) + 1 >= stops["lightRail"].length;
    }

    if (etas === null) {
      return null;
    }

    if (isEndOfTrainLine && etas.length === 0) {
      return t("終點站");
    } else if (
      etas.length > 0 &&
      etas.every((e) => !e.eta) &&
      etas[0].remark[language]
    ) {
      return etas[0].remark[language];
    } else if (etas.length === 0 || etas.every((e) => !e.eta)) {
      return t("未有班次資料");
    }
    return null;
  }, [etas, co, stops, stopId, t, language]);

  if (etas == null) {
    return (
      <Box className={className}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box className={className}>
      {showStopName && (
        <Typography variant="caption">
          {stopList[stopId].name[language]}
        </Typography>
      )}
      {noScheduleRemark}
      {etas.length > 0 &&
        etas.every((e) => e.eta) &&
        etas.map((eta, idx) => (
          <EtaLine
            key={`route-${idx}`}
            eta={eta}
            routeDests={routeDests}
            showCompany={co.length > 1}
            route={route}
          />
        ))}
    </Box>
  );
};

interface EtaMsgProps {
  eta: Eta;
  routeDests: Terminal[];
  showCompany: boolean;
  route: string;
}

const EtaLine = ({
  eta: { eta, remark, co, dest },
  routeDests,
  showCompany,
  route,
}: EtaMsgProps) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const { etaFormat, platformMode } = useContext(AppContext);

  const branchRoute = useMemo(() => {
    if (co === "mtr") {
      return true;
    }
    for (const routeDest of routeDests) {
      if (routeDest.en.toLowerCase() === dest.en.toLowerCase()) {
        return false;
      }
      if (routeDest.zh === dest.zh) {
        return false;
      }
    }
    return true;
  }, [routeDests, dest, co]);

  const waitTime = Math.round(
    (new Date(eta).getTime() - new Date().getTime()) / 60 / 1000
  );

  const exactTimeJsx = (
    <span className={etaFormat !== "exact" ? "text-[0.9em]" : ""}>
      {eta.slice(11, 16)}
    </span>
  );

  const isTrain = co === "mtr" || co === "lightRail";

  let waitTimeText;
  let trainTextUsed;
  if (isTrain && waitTime <= 1) {
    waitTimeText = waitTime === 1 ? `${t("即將抵達")} ` : `${t("正在離開")} `;
    trainTextUsed = true;
  } else {
    waitTimeText = waitTime < 1 ? " - " : `${waitTime} `;
    trainTextUsed = false;
  }

  const waitTimeJsx = (
    <span>
      <span
        className={cn(
          "font-bold",
          "text-amber-500",
          trainTextUsed ? "text-[0.9em]" : ""
        )}
      >
        {waitTimeText}
      </span>
      {!trainTextUsed && <span className="text-[0.8em]">{t("分鐘")}</span>}
    </span>
  );

  return (
    <Typography variant="subtitle1" className="flex justify-center">
      {etaFormat === "diff" && waitTimeJsx}
      {etaFormat === "exact" && exactTimeJsx}
      {etaFormat === "mixed" && (
        <>
          {exactTimeJsx}&emsp;{waitTimeJsx}
        </>
      )}
      {!isTrain && <>&emsp;-&nbsp;</>}
      <span className="text-[0.8em] text-ellipsis overflow-hidden">
        {showCompany && <>&emsp;{t(co)}</>}
        &emsp;
        <EtaRemark
          remark={remark}
          co={co}
          language={language}
          route={route}
          platformMode={platformMode}
        />
        {isTrain && " "}
        {!isTrain && <>&emsp;</>}
        {branchRoute && dest[language]}
      </span>
    </Typography>
  );
};

interface EtaRemarkProps {
  remark: Eta["remark"];
  co: Eta["co"];
  route: string;
  platformMode: boolean;
  language: "zh" | "en";
}

const EtaRemark = ({
  remark,
  language,
  co,
  route,
  platformMode,
}: EtaRemarkProps) => {
  if (remark === null) return "";

  const isTrain = co === "mtr" || co === "lightRail";
  if (!isTrain) {
    return remark[language];
  }

  const parts: string[] = [];
  let ret = "";
  let trains = "";

  (remark.en || remark[language]).split(" - ").forEach((part, i) => {
    const platform = [...(part.matchAll(/^Platform (\d+)$/g) ?? [])][0] || [];
    if (platform.length === 2 && platform[1].length) {
      ret = getPlatformSymbol(Number(platform[1]), platformMode) ?? platform[1];
      return;
    }

    const trainsLocal = (/^▭+$/g.exec(part) ?? [])[0];
    if (trainsLocal) {
      trains = trainsLocal;
      return;
    }

    parts.push(remark[language].split(" - ")[i]);
  });

  return (
    <>
      <span style={{ color: getLineColor([co], route, true) }} className="mx-1">
        {ret}
      </span>
      <span className="mx-1">
        {trains.length === 1 && <SingleTrainIcon />}
        {trains.length === 2 && <DoubleTrainIcon />}
      </span>
      {parts.map((part, i) => (
        <span key={i} className="mx-1">
          {part}
        </span>
      ))}
    </>
  );
};

export default TimeReport;
