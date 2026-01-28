import { Sheet, SheetContent } from "../ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TimeTable from "./timetableDrawer/TimeTable";
import JourneyTimePanel from "./timetableDrawer/JourneyTimePanel";

interface TimetableDrawerProps {
  routeId: string;
  open: boolean;
  onClose: () => void;
}

const TimetableDrawer = ({ routeId, open, onClose }: TimetableDrawerProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"schedule" | "jt">("jt");

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-[80%] max-w-[320px] pt-[56px] pl-5 bg-background overflow-y-auto"
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as "schedule" | "jt")}>
          <TabsList className="bg-background min-h-[36px] justify-start">
            <TabsTrigger
              value="jt"
              className="min-h-[32px] py-0 px-4 items-center justify-center"
            >
              {t("車程")}
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="min-h-[32px] py-0 px-4 items-center justify-center"
            >
              {t("時間表")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {tab === "jt" && <JourneyTimePanel routeId={routeId} />}
        {tab === "schedule" && <TimeTable routeId={routeId} />}
      </SheetContent>
    </Sheet>
  );
};

export default TimetableDrawer;
