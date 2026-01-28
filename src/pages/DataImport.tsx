import { useCallback, useContext, useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { decompress } from "lzutf8-light";
import { Check } from "lucide-react";
import throttle from "lodash.throttle";
import AppContext, { AppState } from "../context/AppContext";
import { DEFAULT_SEARCH_RANGE, isStrings } from "../utils";
import CollectionContext, { CollectionState } from "../CollectionContext";
import { cn } from "../lib/utils";

const DataImport = () => {
  const { data } = useParams();
  const { t } = useTranslation();
  const { importAppState } = useContext(AppContext);
  const { importCollectionState } = useContext(CollectionContext);
  const navigate = useNavigate();
  const [state, setState] = useState<string>(data ?? "");

  const unpack = useMemo(
    () =>
      throttle((str: string) => {
        try {
          return JSON.parse(
            decompress(decodeURIComponent(str).replace(/-/g, "/"), {
              inputEncoding: "Base64",
            })
          );
        } catch (e) {
          return {};
        }
      }, 500),
    []
  );

  const obj = useMemo<AppState & CollectionState>(() => {
    try {
      let obj = unpack(data ?? state.split("/").pop() ?? "");

      if (!Array.isArray(obj.savedStops) || !isStrings(obj.savedStops)) {
        throw new Error("Error in parsing savedStops");
      }
      if (!Array.isArray(obj.savedEtas) || !isStrings(obj.savedEtas)) {
        throw new Error("Error in parsing savedEtas");
      }
      if (!Array.isArray(obj.collections)) {
        throw new Error("Error in parsing collections");
      }
      for (let i = 0; i < obj.collections.length; ++i) {
        if (typeof obj.collections[i].name !== "string") {
          throw new Error("Error in parsing collections");
        }
        for (let j = 0; j < obj.collections[i].list.length; ++j) {
          if (typeof obj.collections[i].list[j] !== "string") {
            throw new Error("Error in parsing collections");
          }
        }
        for (let j = 0; j < obj.collections[i].schedules.length; ++j) {
          if (typeof obj.collections[i].schedules[j].day !== "number") {
            throw new Error("Error in parsing collections");
          }
          if (typeof obj.collections[i].schedules[j].start.hour !== "number") {
            throw new Error("Error in parsing collections");
          }
          if (
            typeof obj.collections[i].schedules[j].start.minute !== "number"
          ) {
            throw new Error("Error in parsing collections");
          }
          if (typeof obj.collections[i].schedules[j].end.hour !== "number") {
            throw new Error("Error in parsing collections");
          }
          if (typeof obj.collections[i].schedules[j].end.minute !== "number") {
            throw new Error("Error in parsing collections");
          }
        }
      }

      return obj;
    } catch (e) {
      console.error(e);
    }
    return {};
  }, [unpack, data, state]);

  const objStrForm = useMemo(() => JSON.stringify(obj, null, 2), [obj]);

  const confirm = useCallback(() => {
    if (objStrForm === "{}") return;
    importCollectionState({
      savedStops: obj.savedStops ?? [],
      savedEtas: obj.savedEtas ?? [],
      collections: obj.collections ?? [],
      collectionDrawerRoute: null,
      collectionIdx: null,
    });
    importAppState({
      geoPermission: null,
      compassPermission: "default",
      manualGeolocation: null,
      searchRoute: "",
      selectedRoute: "1-1-CHUK-YUEN-ESTATE-STAR-FERRY",
      routeSearchHistory: obj.routeSearchHistory ?? [],
      isRouteFilter: obj.isRouteFilter ?? true,
      busSortOrder: obj.busSortOrder ?? "KMB first",
      numPadOrder: obj.numPadOrder ?? "123456789c0b",
      etaFormat: obj.etaFormat ?? "diff",
      _colorMode: obj._colorMode ?? "system",
      energyMode: obj.energyMode ?? false,
      platformMode: obj.platformMode ?? false,
      vibrateDuration: obj.vibrateDuration ?? 1,
      isVisible: true,
      analytics: obj.analytics ?? true,
      refreshInterval: obj.refreshInterval ?? 30,
      annotateScheduled: obj.annotateScheduled ?? true,
      isRecentSearchShown: obj.isRecentSearchShown ?? true,
      fontSize: obj.fontSize ?? 16,
      searchRange: obj.searchRange ?? DEFAULT_SEARCH_RANGE,
      isSearching: obj.isSearching ?? false,
    });

    navigate("/");
  }, [obj, objStrForm, importAppState, importCollectionState, navigate]);

  return (
    <div className="flex flex-col justify-start flex-1 gap-1">
      <h6 className="text-center font-semibold">{t("資料匯入")}</h6>
      {!data && (
        <Input
          value={state}
          onChange={({ target: { value } }) => setState(value)}
          className="w-full"
        />
      )}
      <textarea
        rows={15}
        value={objStrForm}
        disabled
        className="w-full p-2 text-sm rounded-md border bg-muted disabled:opacity-50"
      />
      <Button
        variant="outline"
        disabled={objStrForm === "{}"}
        onClick={confirm}
        className={cn("border", "text-foreground", "gap-2")}
      >
        <Check className="h-4 w-4" />
        {t("Accept")}
      </Button>
    </div>
  );
};

export default DataImport;
