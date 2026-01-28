import { useCallback, useContext } from "react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Checkbox } from "../../ui/checkbox";
import { Box } from "../../ui/box";
import { Typography } from "../../ui/Typography";
import { Icon } from "../../ui/Icon";
import { useTranslation } from "react-i18next";
import ReactNativeContext from "../../../context/ReactNativeContext";
import CollectionContext from "../../../CollectionContext";
import DbContext from "../../../context/DbContext";
import { Watch } from "lucide-react";

const WatchEntry = () => {
  const { collectionDrawerRoute } = useContext(CollectionContext);
  const {
    db: { routeList },
  } = useContext(DbContext);
  const { os } = useContext(ReactNativeContext);
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (collectionDrawerRoute === null) return;
    const [routeId, seq] = collectionDrawerRoute.split("/");
    const isApple =
      os === "ios" || /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
    const subdomain = isApple ? "watch" : "wear";
    try {
      const stopId = seq
        ? routeList[routeId].stops[routeList[routeId].co[0]][Number(seq)]
        : undefined;
      const url = `https://${subdomain}.hkbus.app/route/${routeId.toLowerCase()}/${
        stopId ? stopId + "%2C" + seq : seq
      }`;
      console.log(url);
      window.open(url, "_blank");
    } catch (error) {
      console.error(error);
      const url = `https://${subdomain}.hkbus.app/route/${routeId.toLowerCase()}`;
      window.open(url, "_blank");
    }
  }, [os, collectionDrawerRoute, routeList]);

  return (
    <Box className="flex flex-1 justify-between">
      <Box
        className="flex flex-1 cursor-pointer items-center gap-2"
        onClick={handleClick}
      >
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Icon icon={Watch} />
          </AvatarFallback>
        </Avatar>
        <Box className="flex flex-col">
          <Typography variant="body1">{t("智能手錶應用程式")}</Typography>
        </Box>
      </Box>
      <Box className="flex">
        <Checkbox checked={false} onClick={handleClick} />
      </Box>
    </Box>
  );
};

export default WatchEntry;
