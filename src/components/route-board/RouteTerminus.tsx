import { useTranslation } from "react-i18next";
import { Typography } from "../ui/Typography";
import { toProperCase } from "../../utils";
import { RouteListEntry } from "hk-bus-eta";
import useLanguage from "../../hooks/useTranslation";

interface RouteTerminus {
  terminus: RouteListEntry;
}

const RouteTerminus = ({ terminus }: RouteTerminus) => {
  const { t } = useTranslation();
  const language = useLanguage();

  return (
    <div className="text-left">
      <div className="flex items-baseline whitespace-nowrap overflow-x-hidden">
        <span className="text-[0.95em] mr-0.5">{`${t("往")} `}</span>
        <Typography component="h3" variant="h6" className="font-bold">
          {toProperCase(terminus.dest[language])}
        </Typography>
      </div>
      <div className="flex items-baseline whitespace-nowrap overflow-x-hidden">
        <Typography variant="body2">
          {toProperCase(terminus.orig[language])}
        </Typography>
      </div>
    </div>
  );
};

export default RouteTerminus;
