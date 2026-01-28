import { useContext, useMemo } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import { useTranslation } from "react-i18next";
import AppContext from "../context/AppContext";
import { Copy } from "lucide-react";
import { compress as compressJson } from "lzutf8-light";
import useLanguage from "../hooks/useTranslation";
import CollectionContext from "../CollectionContext";
import { useToast } from "../hooks/use-toast";

const DataExport = () => {
  const { t } = useTranslation();
  const language = useLanguage();
  const { savedStops, savedEtas, collections } = useContext(CollectionContext);
  const {
    _colorMode,
    energyMode,
    platformMode,
    refreshInterval,
    annotateScheduled,
    vibrateDuration,
    etaFormat,
    numPadOrder,
    isRouteFilter,
    busSortOrder,
    analytics,
    isRecentSearchShown,
  } = useContext(AppContext);
  const { toast } = useToast();

  const exportUrl = useMemo<string>(
    () =>
      `https://${window.location.hostname}/${language}/import/` +
      encodeURIComponent(
        compressJson(
          JSON.stringify(
            {
              savedStops,
              savedEtas,
              collections,
              _colorMode,
              energyMode,
              platformMode,
              refreshInterval,
              annotateScheduled,
              vibrateDuration,
              etaFormat,
              numPadOrder,
              isRouteFilter,
              busSortOrder,
              analytics,
              isRecentSearchShown,
            },
            null,
            0
          ),
          { outputEncoding: "Base64" }
        ).replace(/\//g, "-")
      ),
    [
      collections,
      savedEtas,
      savedStops,
      _colorMode,
      energyMode,
      platformMode,
      refreshInterval,
      annotateScheduled,
      vibrateDuration,
      etaFormat,
      numPadOrder,
      isRouteFilter,
      busSortOrder,
      language,
      analytics,
      isRecentSearchShown,
    ]
  );

  return (
    <div className="flex flex-col justify-center flex-1 gap-1">
      <h6 className="text-center font-semibold">{t("資料匯出")}</h6>
      <div className="flex flex-col items-center m-1">
        <Input value={exportUrl} spellCheck={false} className="w-full" />
        <div className="m-1">
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Export hkbus.app", url: exportUrl });
              } else {
                navigator.clipboard?.writeText(exportUrl).then(() => {
                  toast({ description: t("已複製到剪貼簿") });
                });
              }
            }}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            {t("複制匯出網址")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
