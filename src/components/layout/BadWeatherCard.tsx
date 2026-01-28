import { useTranslation } from "react-i18next";
import { useWeather } from "../Weather";
import { Icon } from "../ui/Icon";
import { Alert } from "../ui/alert";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { AlertTriangle } from "lucide-react";

const BadWeatherCard = () => {
  const { t } = useTranslation();
  const weather = useWeather();
  const { openUrl } = useContext(AppContext);

  const isAdverse = () => {
    if (!weather) {
      return false;
    } else if (weather.WTCSGNL && adverseWCode.includes(weather.WTCSGNL.code)) {
      return true;
    } else if (weather.WRAIN && adverseRCode.includes(weather.WRAIN.code)) {
      return true;
    } else {
      return false;
    }
  };

  if (navigator.userAgent !== "prerendering" && isAdverse()) {
    return (
      <Alert
        variant="warning"
        className="rounded-lg border cursor-pointer px-2 py-1 flex items-center gap-1 text-left"
        onClick={() => openUrl(t("bad-weather-link"))}
      >
        <Icon icon={AlertTriangle} className="text-warning" />
        <span className="text-sm">{t("bad-weather-text")}</span>
      </Alert>
    );
  } else {
    return null;
  }
};

export default BadWeatherCard;

const adverseWCode = ["TC8NE", "TC8SE", "TC8NW", "TC8SW", "TC9", "TC10"];
const adverseRCode = ["WARINR", "WRAINB"];
