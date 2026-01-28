import { useContext } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { cn } from "../../lib/utils";
import {
  ArrowUp,
  Battery,
  BatteryCharging,
  Trash2,
  Timer,
  Moon,
  SunMedium,
  Sun,
  Infinity,
  Filter,
  Smartphone,
  BellOff,
  Flame,
  ArrowUpDown,
  Hourglass,
  MapPin,
  RefreshCw,
  RefreshCwOff,
  Type,
  Minimize2,
} from "lucide-react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { ETA_FORMAT_STR } from "../../constants";
import AppContext from "../../context/AppContext";
import { vibrate } from "../../utils";
import { useTranslation } from "react-i18next";
import FontSizeSlider from "./FontSizeSlider";

interface OptionsListProps {
  goToManage: () => void;
}

const OptionsList = ({ goToManage }: OptionsListProps) => {
  const {
    resetUsageRecord,
    isRouteFilter,
    toggleRouteFilter,
    busSortOrder,
    toggleBusSortOrder,
    numPadOrder,
    toggleNumPadOrder,
    etaFormat,
    toggleEtaFormat,
    _colorMode: colorMode,
    toggleColorMode,
    energyMode,
    toggleEnergyMode,
    platformMode,
    togglePlatformMode,
    vibrateDuration,
    toggleVibrateDuration,
    refreshInterval,
    updateRefreshInterval,
    annotateScheduled,
    toggleAnnotateScheduled,
    isRecentSearchShown,
    toggleIsRecentSearchShown,
  } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <div className="py-0">
      <SettingItem
        icon={<ArrowUp className="h-5 w-5" />}
        primary={t("管理收藏")}
        onClick={() => {
          vibrate(vibrateDuration);
          goToManage();
        }}
      />
      <SettingItem
        icon={
          isRouteFilter ? (
            <Filter className="h-5 w-5" />
          ) : (
            <Infinity className="h-5 w-5" />
          )
        }
        primary={t("路線篩選")}
        secondary={t(isRouteFilter ? "只顯示現時路線" : "顯示所有路線")}
        onClick={() => {
          vibrate(vibrateDuration);
          toggleRouteFilter();
        }}
      />
      <SettingItem
        icon={<ArrowUpDown className="h-5 w-5" />}
        primary={t("巴士排序")}
        secondary={t(busSortOrder)}
        onClick={() => {
          vibrate(vibrateDuration);
          toggleBusSortOrder();
        }}
      />
      <div className="flex items-center gap-4 p-4">
        <Avatar>
          <AvatarFallback>
            <Hourglass className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Label>{t("更新頻率")}</Label>
          </div>
          <Slider
            step={1}
            min={5}
            max={60}
            value={[refreshInterval / 1000]}
            onValueChange={([v]: number[]) => updateRefreshInterval(v * 1000)}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {refreshInterval / 1000}s
          </p>
        </div>
      </div>
      <Separator />
      <SettingItem
        icon={
          colorMode === "system" ? (
            <SunMedium className="h-5 w-5" />
          ) : colorMode === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )
        }
        primary={t("外觀")}
        secondary={t(`color-${colorMode}`)}
        onClick={() => {
          vibrate(vibrateDuration);
          toggleColorMode();
        }}
      />
      <div className="flex items-center gap-4 p-4">
        <Avatar>
          <AvatarFallback>
            <Type className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <FontSizeSlider />
        </div>
      </div>
      <SettingItem
        icon={
          numPadOrder[0] === "1" ? (
            <Flame className="h-5 w-5" />
          ) : (
            <Minimize2 className="h-5 w-5" />
          )
        }
        primary={t("鍵盤格式")}
        secondary={numPadOrder}
        onClick={() => {
          vibrate(vibrateDuration);
          toggleNumPadOrder();
        }}
      />
      <SettingItem
        icon={<Timer className="h-5 w-5" />}
        primary={t("報時格式")}
        secondary={t(ETA_FORMAT_STR[etaFormat])}
        onClick={() => {
          vibrate(vibrateDuration);
          toggleEtaFormat();
        }}
      />
      <SettingItem
        icon={<MapPin className="h-5 w-5" />}
        primary={t("注釋預定班次")}
        secondary={t(annotateScheduled ? "開啟" : "關閉")}
        onClick={() => {
          vibrate(vibrateDuration);
          toggleAnnotateScheduled();
        }}
      />
      <SettingItem
        icon={<Type className="h-5 w-5" />}
        primary={t("月台顯示格式")}
        secondary={t(platformMode ? "➊" : "①")}
        onClick={() => {
          vibrate(vibrateDuration);
          togglePlatformMode();
        }}
      />
      <SettingItem
        icon={
          energyMode ? (
            <Battery className="h-5 w-5" />
          ) : (
            <BatteryCharging className="h-5 w-5" />
          )
        }
        primary={t("省電模式")}
        secondary={t(!energyMode ? "開啟地圖功能" : "關閉地圖功能")}
        onClick={() => {
          vibrate(vibrateDuration);
          toggleEnergyMode();
        }}
      />
      <SettingItem
        icon={
          isRecentSearchShown ? (
            <RefreshCw className="h-5 w-5" />
          ) : (
            <RefreshCwOff className="h-5 w-5" />
          )
        }
        primary={t("搜尋記錄")}
        secondary={t(isRecentSearchShown ? "開啟" : "關閉")}
        onClick={() => {
          vibrate(vibrateDuration ^ 1);
          toggleIsRecentSearchShown();
        }}
      />
      <SettingItem
        icon={
          vibrateDuration ? (
            <Smartphone className="h-5 w-5" />
          ) : (
            <BellOff className="h-5 w-5" />
          )
        }
        primary={t("按鍵震動")}
        secondary={t(vibrateDuration ? "開啟" : "關閉")}
        onClick={() => {
          vibrate(vibrateDuration ^ 1);
          toggleVibrateDuration();
        }}
      />
      <Separator />
      <SettingItem
        icon={<Trash2 className="h-5 w-5" />}
        primary={t("一鍵清空用戶記錄")}
        secondary={t("包括鎖定和常用報時")}
        onClick={() => {
          vibrate(vibrateDuration);
          if (window.confirm(t("確定清空？"))) {
            resetUsageRecord();
          }
        }}
      />
    </div>
  );
};

export default OptionsList;

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
      <Avatar>
        <AvatarFallback>{icon}</AvatarFallback>
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
