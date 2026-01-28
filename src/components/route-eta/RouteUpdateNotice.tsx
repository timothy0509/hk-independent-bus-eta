import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DbContext from "../../context/DbContext";
import { fetchRouteUpdatedAt, RouteListEntry } from "hk-bus-eta";
import { Box } from "../ui/box";
import { Typography } from "../ui/Typography";
import { cn } from "../../lib/utils";

interface RouteUpdateNoticeProps {
  route: RouteListEntry;
}

const RouteUpdateNotice = ({ route }: RouteUpdateNoticeProps) => {
  const [show, setShow] = useState<boolean>(false);
  const {
    db: { updateTime },
    renewDb,
  } = useContext(DbContext);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRouteUpdatedAt(route).then((updatedAt) =>
      setShow(updatedAt > updateTime)
    );
  }, [route, updateTime]);

  if (!show) {
    return null;
  }

  return (
    <Box
      className={cn(
        "flex justify-center flex-1 w-full p-2 my-1 border border-solid border-border rounded-sm cursor-pointer",
        "hover:bg-muted/50"
      )}
      onClick={renewDb}
    >
      <Typography>⁉️ {t("db-renew-text")}</Typography>
    </Box>
  );
};

export default RouteUpdateNotice;
