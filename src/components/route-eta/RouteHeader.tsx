import { useContext } from "react";
import { Typography } from "../ui/Typography";
import RouteNo from "../route-board/RouteNo";
import { toProperCase } from "../../utils";
import { useTranslation } from "react-i18next";
import ReverseButton from "./ReverseButton";
import TimetableButton from "./TimeTableButton";
import RouteStarButton from "./RouteStarButton";
import useLanguage from "../../hooks/useTranslation";
import DbContext from "../../context/DbContext";

interface RouteHeaderProps {
  routeId: string;
  stopId: string;
}

const RouteHeader = ({ routeId, stopId }: RouteHeaderProps) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const {
    db: { routeList },
  } = useContext(DbContext);
  const { route, orig, dest, nlbId } = routeList[routeId];

  return (
    <div id="route-eta-header" className="text-center bg-transparent relative">
      <RouteNo routeNo={t(route)} component="h1" align="center" />
      <Typography component="h2" variant="caption" className="text-center">
        {t("往")} {toProperCase(dest[language])}{" "}
        {nlbId ? t("由") + " " + toProperCase(orig[language]) : ""}
      </Typography>
      <ReverseButton routeId={routeId} stopId={stopId} />
      <div className="absolute top-0 right-[2%]">
        <RouteStarButton routeId={routeId} />
        <TimetableButton routeId={routeId} />
      </div>
    </div>
  );
};

export default RouteHeader;
