import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useTranslation } from "react-i18next";
import { CheckCircle, Activity } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useLanguage from "../../hooks/useTranslation";

const EmotionTabbar = () => {
  const { t } = useTranslation();
  const { tab } = useParams();
  const navigate = useNavigate();
  const language = useLanguage();

  return (
    <Tabs
      value={tab ?? "check-in"}
      onValueChange={(v) => navigate(`/${language}/emotion/${v}`)}
      className="bg-background min-h-[36px]"
    >
      <TabsList className="h-9 min-h-9 justify-start">
        <TabsTrigger
          value="check-in"
          className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          {t("Check in")}
        </TabsTrigger>
        <TabsTrigger
          value="chart"
          className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
        >
          <Activity className="mr-2 h-4 w-4" />
          {t("Emotion Chart")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default EmotionTabbar;

export type EmotionTabType = "check in" | "chart";
