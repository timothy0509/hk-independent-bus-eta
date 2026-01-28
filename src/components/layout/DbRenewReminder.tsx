import { useContext, useMemo } from "react";
import { Typography } from "../ui/Typography";
import { useTranslation } from "react-i18next";
import DbContext from "../../context/DbContext";
import { Alert } from "../ui/alert";

const DbRenewReminder = () => {
  const { t } = useTranslation();

  const {
    db: { updateTime },
    renewDb,
  } = useContext(DbContext);

  const isOutdated = useMemo(
    () => Date.now() > updateTime + 28 * 24 * 3600 * 1000,
    [updateTime]
  );

  if (navigator.userAgent !== "prerendering" && isOutdated) {
    return (
      <Alert
        className="flex w-full cursor-pointer justify-center border bg-transparent text-foreground"
        onClick={renewDb}
      >
        <Typography variant="body2">{t("db-renew-text")}</Typography>
      </Alert>
    );
  } else {
    return null;
  }
};

export default DbRenewReminder;
