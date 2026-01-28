import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { useTranslation } from "react-i18next";
import domtoimage from "dom-to-image";
import mergeImages from "merge-images";
import { toProperCase, triggerShare, triggerShareImg } from "../../utils";
import AppContext from "../../context/AppContext";
import { CircularProgress } from "../Progress";
import { useParams } from "react-router-dom";
import useLanguage from "../../hooks/useTranslation";
import { SharingEntry } from "../../@types/types";
import DbContext from "../../context/DbContext";

export interface SharingModalProps extends SharingEntry {}

interface SharingModalState {
  isOpen: boolean;
  isCopied: boolean;
}

const SharingModal = ({
  routeId,
  seq = -1,
  stopId,
  event,
}: SharingModalProps) => {
  const [{ isOpen, isCopied }, setState] =
    useState<SharingModalState>(DEFAULT_STATE);
  const {
    AppTitle,
    db: { routeList, stopList },
  } = useContext(DbContext);
  const { colorMode } = useContext(AppContext);
  const { t } = useTranslation();
  const language = useLanguage();
  const [imgBase64, setImgBase64] = useState<string>("");
  const { id: routeUri } = useParams();
  const { route, dest } = routeList[routeId];
  const stop = stopList[stopId];

  const setIsOpen = useCallback(
    (isOpen: boolean) => setState((p) => ({ ...p, isOpen })),
    []
  );
  const setIsCopied = useCallback(
    (isCopied: boolean) => setState((p) => ({ ...p, isCopied })),
    []
  );

  useEffect(() => {
    if (event) setIsOpen(true);
  }, [setIsOpen, event]);

  const handleShareLink = useCallback(() => {
    triggerShare(
      `https://${window.location.hostname}/${language}/route/${routeUri}/${stopId}%2C${seq}`,
      `${seq + 1}. ${toProperCase(stop.name[language])} - ${route} ${t(
        "往"
      )} ${toProperCase(dest[language])} - ${t(AppTitle)}`
    )
      .then(() => {
        if (navigator.clipboard) setIsCopied(true);
      })
      .finally(() => {
        setIsOpen(false);
      });
  }, [
    AppTitle,
    routeUri,
    dest,
    t,
    setIsCopied,
    language,
    seq,
    stop.name,
    stopId,
    route,
    setIsOpen,
  ]);

  useEffect(() => {
    // @ts-expect-error harmonyShare is defined in mobile app
    if (isOpen && window.harmonyShare) {
      handleShareLink();
      return;
    }
    if (isOpen) {
      Promise.all([
        domToImage("route-eta-header", colorMode),
        domToImage("route-map", colorMode),
        domToImage(`stop-${seq}`, colorMode),
      ])
        .then((rawBase64s) => {
          let baseH = 0;
          return mergeImages(
            rawBase64s
              .filter(([v]) => v)
              .map(([rawBase64, h]) => {
                baseH += h as number;
                return {
                  src: rawBase64,
                  x: 0,
                  y: baseH - h,
                };
              }),
            {
              height: baseH,
            }
          );
        })
        .then((b64) => {
          setImgBase64(b64);
        });
    }
    return () => {
      setImgBase64("");
    };
  }, [isOpen, colorMode, seq, handleShareLink]);

  const handleShareImg = useCallback(() => {
    triggerShareImg(
      imgBase64,
      `https://${window.location.hostname}/${language}/route/${routeUri}/${stopId}%2C${seq}`,
      `${seq + 1}. ${toProperCase(stop.name[language])} - ${route} ${t(
        "往"
      )} ${toProperCase(dest[language])} - https://hkbus.app/`
    )
      .then(() => {
        if (navigator.clipboard) setIsCopied(true);
      })
      .finally(() => {
        setIsOpen(false);
      });
  }, [
    dest,
    setIsCopied,
    setIsOpen,
    stop.name,
    stopId,
    t,
    imgBase64,
    language,
    routeUri,
    seq,
    route,
  ]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <DialogContent className="flex items-center justify-center outline-none max-w-xs">
          <div className="flex flex-col items-center justify-center flex-1 bg-background w-full">
            <div className="flex items-center justify-center h-[400px] w-full">
              {imgBase64 ? (
                <img
                  src={imgBase64}
                  className="object-contain w-[396px] h-[400px]"
                  alt=""
                />
              ) : (
                <CircularProgress color="inherit" />
              )}
            </div>
            <div className="flex w-full bg-background">
              <Button
                className="flex-1 border border-white/30"
                onClick={handleShareLink}
              >
                {t("以鏈結分享")}
              </Button>
              <Button
                className="flex-1 border border-white/30"
                onClick={handleShareImg}
                disabled={imgBase64 === ""}
              >
                {t("以圖片分享")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {isCopied && (
        <Alert className="fixed bottom-0 left-1/2 -translate-x-1/2">
          <AlertDescription>{t("已複製到剪貼簿")}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

const domToImage = (
  domId: string,
  colorMode: "dark" | "light"
): Promise<[string, number, number]> => {
  const el = document.getElementById(domId);
  if (el) {
    return domtoimage
      .toPng(el, {
        bgcolor: colorMode === "light" ? "#fedb00" : "#000",
      })
      .then((base64) => [base64, el.clientHeight, el.clientWidth]);
  } else {
    return Promise.resolve(["", 0, 0]);
  }
};

export default SharingModal;

const DEFAULT_STATE: SharingModalState = {
  isOpen: false,
  isCopied: false,
};
