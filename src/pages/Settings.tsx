import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import AppContext from "../context/AppContext";
import {
  Download,
  Settings as SettingsIcon,
  MapPin,
  MapPinOff,
  DollarSign,
  BarChart3,
  Github,
  Share2,
  Send,
  Fingerprint,
  Gavel,
  Smile,
  Sparkles,
  BarChart,
  Info,
  Smartphone,
  HelpCircle,
  MessageCircle,
  RotateCw,
  RotateCcw,
  ShieldCheck,
  Watch,
  Map,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { useTranslation } from "react-i18next";
import {
  vibrate,
  setSeoHeader,
  triggerShare,
  checkAppInstalled,
  iOSRNWebView,
} from "../utils";
import InstallDialog from "../components/settings/InstallDialog";
import Donations from "../Donations";
import PersonalizeDialog from "../components/settings/PersonalizeDialog";
import { useNavigate } from "react-router-dom";
import ReactNativeContext from "../context/ReactNativeContext";
import useLanguage from "../hooks/useTranslation";
import DbContext from "../context/DbContext";
import { useToast } from "../hooks/use-toast";
import { cn } from "../lib/utils";

const Settings = () => {
  const {
    AppTitle,
    db: { schemaVersion, versionMd5, updateTime },
    renewDb,
    autoRenew,
    toggleAutoDbRenew,
  } = useContext(DbContext);
  const {
    geoPermission,
    updateGeoPermission,
    vibrateDuration,
    toggleAnalytics,
    analytics,
    openUrl,
  } = useContext(AppContext);
  const { debug, toggleDebug } = useContext(ReactNativeContext);
  const { os } = useContext(ReactNativeContext);
  const [updating, setUpdating] = useState(false);
  const [showGeoPermissionDenied, setShowGeoPermissionDenied] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isOpenInstallDialog, setIsOpenInstallDialog] = useState(false);
  const [isPersonalizeDialog, setIsPersonalizeDialog] = useState(false);
  const { toast } = useToast();

  const { t } = useTranslation();
  const language = useLanguage();
  const donationId = useMemo(
    () => Math.floor(Math.random() * Donations.length),
    []
  );
  const isApple =
    os === "ios" || /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);

  const navigate = useNavigate();

  useEffect(() => {
    setSeoHeader({
      title: t("設定") + " - " + t(AppTitle),
      description: t("setting-page-description"),
      lang: language,
    });
    setUpdating(false);
  }, [updateTime, language, t, AppTitle]);

  // Handle toast notifications
  useEffect(() => {
    if (updating) {
      toast({ description: t("資料更新中") + "..." });
    }
  }, [updating, toast, t]);

  useEffect(() => {
    if (showGeoPermissionDenied) {
      toast({ description: t("無法獲得地理位置定位功能權限") });
      const timer = setTimeout(() => setShowGeoPermissionDenied(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showGeoPermissionDenied, toast, t]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const updateApp = useCallback(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          registration.update();
          window.location.reload();
        })
        .catch(() => {
          console.error(`Not registrated`);
        });
    }
  }, []);

  const showToast = useCallback(
    (message: string) => {
      toast({ description: message });
    },
    [toast]
  );

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto">
      <h1 className="sr-only">{`${t("設定")} - ${t(AppTitle)}`}</h1>
      <div className="py-0">
        {!checkAppInstalled() && !iOSRNWebView() && (
          <SettingItem
            icon={<Download className="h-5 w-5" />}
            primary={t("安裝")}
            secondary={t("安裝巴士預報 App 到裝置")}
            onClick={() => {
              vibrate(vibrateDuration);
              setTimeout(() => setIsOpenInstallDialog(true), 0);
            }}
          />
        )}
        {(import.meta.env.VITE_COMMIT_HASH || import.meta.env.VITE_VERSION) && (
          <SettingItem
            icon={<Info className="h-5 w-5" />}
            primary={`${t("版本")}: ${
              import.meta.env.VITE_VERSION || "unknown"
            }${
              import.meta.env.VITE_COMMIT_HASH
                ? ` - ${import.meta.env.VITE_COMMIT_HASH}`
                : ""
            }`}
            secondary={import.meta.env.VITE_COMMIT_MESSAGE || ""}
            onClick={updateApp}
          />
        )}
        <SettingItem
          icon={<SettingsIcon className="h-5 w-5" />}
          primary={
            `${t("更新路線資料庫")}: ` +
            `${schemaVersion} - ${versionMd5.slice(0, 6)}`
          }
          secondary={
            t("更新時間") +
            ": " +
            new Date(updateTime).toLocaleString().slice(0, 20).replace(",", " ")
          }
          onClick={() => {
            vibrate(vibrateDuration);
            setUpdating(true);
            renewDb();
          }}
        />
        <Separator />
        <SettingItem
          icon={
            geoPermission === "granted" ? (
              <MapPin className="h-5 w-5" />
            ) : (
              <MapPinOff className="h-5 w-5" />
            )
          }
          primary={t("地理位置定位功能")}
          secondary={t(
            geoPermission === "granted"
              ? "開啟"
              : geoPermission === "opening" || geoPermission === "force-opening"
                ? "開啟中..."
                : "關閉"
          )}
          onClick={() => {
            vibrate(vibrateDuration);
            if (geoPermission === "granted") {
              updateGeoPermission("closed");
            } else if (
              geoPermission === "force-opening" ||
              geoPermission === "opening"
            ) {
              updateGeoPermission("closed");
            } else {
              updateGeoPermission("force-opening", () => {
                setShowGeoPermissionDenied(true);
              });
            }
          }}
        />
        <SettingItem
          icon={
            autoRenew ? (
              <RotateCw className="h-5 w-5" />
            ) : (
              <RotateCcw className="h-5 w-5" />
            )
          }
          primary={t("自動更新路線資料")}
          secondary={t(autoRenew ? "開啟" : "關閉")}
          onClick={() => {
            vibrate(vibrateDuration);
            toggleAutoDbRenew();
          }}
        />
        <SettingItem
          icon={<Smile className="h-5 w-5" />}
          primary={t("個性化設定")}
          secondary={t("日夜模式、時間格式、路線次序等")}
          onClick={() => {
            vibrate(vibrateDuration);
            setIsPersonalizeDialog(true);
          }}
        />
        <SettingItem
          icon={<Smartphone className="h-5 w-5" />}
          primary={t("資料匯出")}
          onClick={() => {
            vibrate(vibrateDuration);
            navigate(`/${language}/export`);
          }}
        />
        <SettingItem
          icon={<ShieldCheck className="h-5 w-5" />}
          primary={t("資料匯入")}
          onClick={() => {
            vibrate(vibrateDuration);
            navigate(`/${language}/import`);
          }}
        />
        <Separator />
        <SettingItem
          icon={<Share2 className="h-5 w-5" />}
          primary={t("複製應用程式鏈結")}
          secondary={t("經不同媒介分享給親友")}
          onClick={() => {
            vibrate(vibrateDuration);
            triggerShare(
              `https://${window.location.hostname}`,
              t("巴士到站預報 App")
            ).then(() => {
              if (navigator.clipboard) {
                setIsCopied(true);
                showToast(t("鏈結已複製到剪貼簿"));
              }
            });
          }}
        />
        {typeof (window as any).harmonyBridger === "undefined" && (
          <SettingItem
            icon={<Watch className="h-5 w-5" />}
            primary={t("智能手錶應用程式")}
            secondary={t("支援 WearOS 及 WatchOS 平台")}
            onClick={() => {
              vibrate(vibrateDuration);
              openUrl(
                isApple ? `https://watch.hkbus.app/` : `https://wear.hkbus.app/`
              );
            }}
          />
        )}
        {!iOSRNWebView() ? (
          <SettingItem
            icon={<Send className="h-5 w-5" />}
            primary={t("Telegram 交流區")}
            secondary={t("歡迎意見及技術交流")}
            onClick={() => {
              vibrate(vibrateDuration);
              openUrl("https://t.me/hkbusapp");
            }}
          />
        ) : (
          <SettingItem
            icon={<HelpCircle className="h-5 w-5" />}
            primary={t("協助")}
            secondary={t("歡迎意見及技術交流")}
            onClick={() => {
              vibrate(vibrateDuration);
              navigate(`/${language}/support`);
            }}
          />
        )}
        {!iOSRNWebView() && (
          <SettingItem
            icon={<BarChart className="h-5 w-5" />}
            primary={"Google Analytics"}
            secondary={t(analytics ? "開啟" : "關閉")}
            onClick={toggleAnalytics}
          />
        )}
        <SettingItem
          icon={<Sparkles className="h-5 w-5" />}
          primary={t("統計數據彙整")}
          secondary={t("整理從 Google 收集的數據")}
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(
              "https://datastudio.google.com/embed/reporting/de590428-525e-4865-9d37-a955204b807a/page/psfZC"
            );
          }}
        />
        {!iOSRNWebView() &&
          typeof (window as any).harmonyBridger === "undefined" && (
            <SettingItem
              icon={<DollarSign className="h-5 w-5" />}
              primary={t("捐款支持")}
              secondary={Donations[donationId].description[language]}
              onClick={() => {
                vibrate(vibrateDuration);
                openUrl(Donations[donationId].url[language]);
              }}
            />
          )}
        <Separator />
        <SettingItem
          icon={<Github className="h-5 w-5" />}
          primary={t("Source code")}
          secondary={"GPL-3.0 License"}
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(
              import.meta.env.VITE_REPO_URL ||
                `https://github.com/hkbus/hk-independent-bus-eta`
            );
          }}
        />
        <SettingItem
          icon={<MessageCircle className="h-5 w-5" />}
          primary={t("FAQ")}
          secondary="Eng Version is currently not available"
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl("/faq");
          }}
        />
        <SettingItem
          icon={
            <Avatar>
              <AvatarImage src="/img/logo128.png" alt="App Logo" />
              <AvatarFallback>Logo</AvatarFallback>
            </Avatar>
          }
          primary={t("圖標來源")}
          secondary={"陳瓜 Chan Gua"}
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(`https://instagram.com/chan_gua`);
          }}
        />
        <SettingItem
          icon={<Map className="h-5 w-5" />}
          primary={t("地圖資源")}
          secondary={"HK pmtiles Generation by @anscg"}
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(`https://github.com/anscg/hk-pmtiles-generation`);
          }}
        />
        <SettingItem
          icon={<Fingerprint className="h-5 w-5" />}
          primary={t("隱私權聲明")}
          onClick={() => {
            vibrate(vibrateDuration);
            navigate(`/${language}/privacy`);
          }}
        />
        <SettingItem
          icon={<Gavel className="h-5 w-5" />}
          primary={t("條款")}
          onClick={() => {
            vibrate(vibrateDuration);
            navigate(`/${language}/terms`);
          }}
        />
        <SettingItem
          icon={<BarChart3 className="h-5 w-5" />}
          primary={t("交通資料來源") + ` ${debug === true ? "DEBUG" : ""}`}
          secondary={t("開放數據平台") + "  https://data.gov.hk"}
          onClick={toggleDebug}
        />
      </div>
      <InstallDialog
        open={isOpenInstallDialog}
        handleClose={() => setIsOpenInstallDialog(false)}
      />
      <PersonalizeDialog
        open={isPersonalizeDialog}
        onClose={() => setIsPersonalizeDialog(false)}
      />
    </div>
  );
};

export default Settings;

interface SettingItemProps {
  icon: React.ReactNode;
  primary: string;
  secondary?: string;
  onClick?: () => void;
}

const SettingItem = ({
  icon,
  primary,
  secondary,
  onClick,
}: SettingItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4",
        onClick && "cursor-pointer hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <Avatar className="bg-muted">
        {typeof icon === "function" ? (
          icon
        ) : (
          <AvatarFallback>{icon}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium">{primary}</p>
        {secondary && (
          <p className="text-sm text-muted-foreground">{secondary}</p>
        )}
      </div>
    </div>
  );
};
