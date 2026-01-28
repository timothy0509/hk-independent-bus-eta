import { useTranslation } from "react-i18next";
import { Typography } from "../ui/Typography";
import RouteNo from "./RouteNo";
import useLanguage from "../../hooks/useTranslation";
import { RouteListEntry } from "hk-bus-eta";

interface RouteNoCompanyProps {
  route: [string, RouteListEntry];
}

const RouteNoCompany = ({ route }: RouteNoCompanyProps) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const [routeNo, serviceType] = route[0].split("-").slice(0, 2);

  return (
    <div className="overflow-hidden">
      <RouteNo
        routeNo={language === "zh" ? t(routeNo) : routeNo}
        fontSize={route[1].co[0] === "mtr" ? "1.2rem" : undefined}
      />
      {parseInt(serviceType, 10) >= 2 && (
        <Typography variant="caption" className="text-[0.6rem] ml-2">
          {t("特別班")}
        </Typography>
      )}
      <Typography
        component="h4"
        variant="caption"
        className="text-muted-foreground"
      >
        {Object.keys(route[1].stops)
          .map((co) => t(co))
          .join("+")}
      </Typography>
    </div>
  );
};

export default RouteNoCompany;
