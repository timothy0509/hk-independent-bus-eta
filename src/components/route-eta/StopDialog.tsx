import {
  Bookmark as BookmarkIcon,
  X as CloseIcon,
  Navigation as DirectionsIcon,
  MapPin as MapIcon,
  Plus as BookmarkBorderIcon,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Icon } from "../ui/Icon";
import { useCallback, useContext, useMemo } from "react";
import StopRouteList from "../bookmarked-stop/StopRouteList";
import { Company } from "hk-bus-eta";
import useLanguage from "../../hooks/useTranslation";
import DbContext from "../../context/DbContext";
import CollectionContext from "../../CollectionContext";
import AppContext from "../../context/AppContext";

interface StopDialogProps {
  open: boolean;
  stops: Array<[Company, string]>;
  onClose: () => void;
}

const StopDialog = ({ open, stops, onClose }: StopDialogProps) => {
  const {
    db: { stopList },
  } = useContext(DbContext);
  const { savedStops, updateSavedStops } = useContext(CollectionContext);
  const { openUrl } = useContext(AppContext);
  const language = useLanguage();

  const bookmarked = useMemo<boolean>(
    () =>
      stops.reduce(
        (acc, cur) => acc || savedStops.includes(cur.join("|")),
        false
      ),
    [stops, savedStops]
  );

  const handleClickDirection = useCallback(() => {
    if (stopList[stops[0][1]]?.location) {
      const { lat, lng } = stopList[stops[0][1]].location;
      openUrl(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`
      );
    }
  }, [stopList, stops, openUrl]);

  const handleClickLocation = useCallback(() => {
    if (stopList[stops[0][1]]?.location) {
      const { lat, lng } = stopList[stops[0][1]].location;
      openUrl(`https://www.google.com/maps/?q=${lat},${lng}`);
    }
  }, [openUrl, stopList, stops]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0">
        <div className="w-full mt-[90px] h-[calc(100vh-100px)]">
          <DialogHeader className="bg-background text-primary flex justify-between items-center p-4 border-b">
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateSavedStops(stops[0].join("|"))}
              >
                {bookmarked ? (
                  <Icon icon={BookmarkIcon} />
                ) : (
                  <Icon icon={BookmarkBorderIcon} />
                )}
              </Button>
              <span>{stopList[stops[0][1]]?.name[language]}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClickDirection}
              >
                <Icon icon={DirectionsIcon} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClickLocation}>
                <Icon icon={MapIcon} />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon icon={CloseIcon} />
            </Button>
          </DialogHeader>
          <StopRouteList stops={stops} isFocus={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StopDialog;
