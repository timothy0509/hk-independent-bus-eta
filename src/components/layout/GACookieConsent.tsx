import { useCallback, useContext, useState } from "react";
import { Box } from "../ui/box";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { useTranslation } from "react-i18next";
import AppContext from "../../context/AppContext";
import { iOSRNWebView } from "../../utils";

const GACookieConsent = () => {
  const { t } = useTranslation();
  const { analytics, toggleAnalytics } = useContext(AppContext);
  const [show, setShow] = useState<boolean>(
    !analytics &&
      localStorage.getItem("consent") === undefined &&
      !iOSRNWebView()
  );

  const handleAccept = useCallback(() => {
    toggleAnalytics();
    setShow(() => {
      localStorage.setItem("consent", "yes");
      return false;
    });
  }, [setShow, toggleAnalytics]);

  const handleReject = useCallback(() => {
    setShow(() => {
      localStorage.setItem("consent", "no");
      return false;
    });
  }, [setShow]);

  if (!show) {
    return <></>;
  }

  return (
    <Box className="flex self-end bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
      <Typography variant="body2" className="p-1">
        {t(
          "We'd like to set analytics cookies that help us improve hkbus.app by measuring how you use it."
        )}
      </Typography>
      <Box className="flex items-center gap-1 p-1">
        <Button
          size="sm"
          className="bg-black text-white dark:bg-white dark:text-black"
          onClick={handleAccept}
        >
          {t("Accept")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleReject}
        >
          {t("Reject")}
        </Button>
      </Box>
    </Box>
  );
};

export default GACookieConsent;
