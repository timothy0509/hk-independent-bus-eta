import { useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Calendar as ScheduleIcon } from "lucide-react";
import TimetableDrawer from "./TimetableDrawer";
import { useTranslation } from "react-i18next";

const TimeTableButton = ({ routeId }: { routeId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute top-0 right-[calc(64px+2%)] border-r border-border h-full"></div>
      <Button
        variant="ghost"
        aria-label="open-timetable"
        className="absolute top-0 right-[2%] flex flex-col justify-center"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon={ScheduleIcon} />
        <span>{t("車程")}</span>
      </Button>
      <TimetableDrawer
        routeId={routeId}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default TimeTableButton;
