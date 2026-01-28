import { useContext } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Typography } from "../ui/Typography";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useTranslation";
import CollectionContext from "../../CollectionContext";
import DbContext from "../../context/DbContext";
import { useHorizontalWheelScroll } from "../../hooks/useHorizontalWheelScroll";

interface HomeTabbarProps {
  stopTab: string | null;
  onChangeTab: (v: string, rerenderList: boolean) => void;
}

const StopTabbar = ({ stopTab, onChangeTab }: HomeTabbarProps) => {
  const { t } = useTranslation();
  const language = useLanguage();
  const { savedStops } = useContext(CollectionContext);
  const {
    db: { stopList },
  } = useContext(DbContext);

  useHorizontalWheelScroll();

  if (savedStops.length === 0) {
    return (
      <>
        <Typography variant="h6">{t("未有收藏車站")}</Typography>
        <Typography variant="body1">{t("請按下圖指示增加")}</Typography>
      </>
    );
  }

  return (
    <Tabs
      value={stopTab || ""}
      onValueChange={(v) => onChangeTab(v, true)}
      className="bg-background min-h-[36px]"
    >
      <TabsList className="h-9 min-h-9 justify-start overflow-x-auto">
        {savedStops
          .map((stopId) => stopId.split("|"))
          .filter(([, stopId]) => stopList[stopId])
          .map(([co, stopId]) => (
            <TabsTrigger
              key={`stops-${stopId}`}
              value={`${co}|${stopId}`}
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground whitespace-nowrap"
            >
              {stopList[stopId].name[language]}
            </TabsTrigger>
          ))}
      </TabsList>
    </Tabs>
  );
};

export default StopTabbar;
