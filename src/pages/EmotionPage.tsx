import { Box } from "../components/ui/box";
import CheckIn from "../components/emotion/CheckIn";
import { useParams } from "react-router-dom";
import { Suspense } from "react";
import EmotionChart from "../components/emotion/EmotionChart";
import EmotionTabbar from "../components/emotion/EmotionTabbar";

const EmotionPage = () => {
  const { tab } = useParams();

  return (
    <div className="text-center flex flex-col overflow-none w-full h-full bg-background">
      <EmotionTabbar />
      <Suspense fallback={<></>}>
        <Box className="overflow-auto">
          {(!tab || tab === "check-in") && <CheckIn />}
          {tab === "chart" && <EmotionChart />}
        </Box>
      </Suspense>
    </div>
  );
};

export default EmotionPage;
