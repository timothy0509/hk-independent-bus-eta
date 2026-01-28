import { Box } from "../ui/box";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Slider } from "../ui/slider";
import { IconButton } from "../ui/icon-button";
import { X } from "lucide-react";
import RangeMap from "./RangeMap";
import { useTranslation } from "react-i18next";
import { useCallback, useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { Location } from "hk-bus-eta";
import { getDistanceWithUnit } from "../../utils";

interface RangeMapDialogProps {
  open: boolean;
  onClose: () => void;
}

interface RangeMapDialogState {
  geolocation: Location;
  searchRange: number;
}

const RangeMapDialog = ({ open, onClose }: RangeMapDialogProps) => {
  const {
    geolocation,
    manualGeolocation,
    searchRange,
    setManualGeolocation,
    setSearchRange,
  } = useContext(AppContext);

  const { t } = useTranslation();

  const [state, setState] = useState<RangeMapDialogState>({
    geolocation: manualGeolocation ?? geolocation.current,
    searchRange,
  });

  const handleClose = useCallback(() => {
    setManualGeolocation(state.geolocation);
    setSearchRange(state.searchRange);
    onClose();
  }, [state, setManualGeolocation, setSearchRange, onClose]);

  const updateGeolocation = useCallback((geolocation: Location) => {
    setState((prev) => ({
      ...prev,
      geolocation,
    }));
  }, []);

  const updateRange = useCallback((searchRange: number) => {
    setState((prev) => ({
      ...prev,
      searchRange,
    }));
  }, []);

  const formatDistanceWithUnit = useCallback(
    (val: number) => {
      const { distance, unit } = getDistanceWithUnit(val);
      return `${distance}${t(unit)}`;
    },
    [t]
  );

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="h-[calc(100dvh-100px)] w-full p-0 flex flex-col">
        <DialogHeader className="bg-background text-primary flex justify-between items-center px-6 py-4">
          <DialogTitle>{t("自訂搜尋範圍")}</DialogTitle>
          <IconButton onClick={handleClose}>
            <X size={18} />
          </IconButton>
        </DialogHeader>
        <RangeMap
          range={state.searchRange}
          value={state.geolocation}
          onChange={updateGeolocation}
        />
        <Box className="px-4 py-5">
          <Slider
            aria-label="Range"
            value={[
              convertScale(state.searchRange, searchRangeScale, sliderScale),
            ]}
            step={250}
            min={sliderScale[0]}
            max={sliderScale[sliderScale.length - 1]}
            onValueChange={([value]) =>
              updateRange(convertScale(value, sliderScale, searchRangeScale))
            }
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {sliderScale.map((val, index) => (
              <span key={val}>
                {formatDistanceWithUnit(searchRangeScale[index])}
              </span>
            ))}
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RangeMapDialog;

const sliderScale = [0, 1000, 2000, 3000, 4000, 5000];
const searchRangeScale = [20, 100, 200, 400, 2000, 4000];

const convertScale = (
  value: number,
  srcScale: number[],
  destScale: number[]
): number => {
  if (value <= srcScale[0]) {
    return destScale[0];
  }
  for (let i = 1; i < srcScale.length; ++i) {
    if (value <= srcScale[i]) {
      return (
        destScale[i - 1] +
        ((value - srcScale[i - 1]) * (destScale[i] - destScale[i - 1])) /
          (srcScale[i] - srcScale[i - 1])
      );
    }
  }
  return destScale[destScale.length - 1];
};
