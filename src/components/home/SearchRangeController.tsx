import { Box } from "../ui/box";
import { Typography } from "../ui/Typography";
import { ToggleButton, ToggleButtonGroup } from "../ui/toggle-button";
import { useTranslation } from "react-i18next";
import { DEFAULT_SEARCH_RANGE_OPTIONS, getDistanceWithUnit } from "../../utils";
import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import RangeMapDialog from "./RangeMapDialog";

const SearchRangeController = () => {
  const { t } = useTranslation();
  const { searchRange, setSearchRange } = useContext(AppContext);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box className="sticky top-0 flex justify-around items-center flex-wrap list-none px-0 py-1 m-0 rounded-none text-sm border-b border-border">
      <Typography variant="caption">{t("搜尋範圍（米）")}:</Typography>
      <ToggleButtonGroup
        value={
          DEFAULT_SEARCH_RANGE_OPTIONS.includes(searchRange)
            ? String(searchRange)
            : "custom"
        }
        onChange={(_, value) => {
          if (value && DEFAULT_SEARCH_RANGE_OPTIONS.includes(Number(value))) {
            setSearchRange(Number(value));
          } else {
            setOpen(true);
          }
        }}
        aria-label="search range"
        exclusive
        size="small"
      >
        {DEFAULT_SEARCH_RANGE_OPTIONS.map((range) => {
          const { distance } = getDistanceWithUnit(range);
          return (
            <ToggleButton
              key={`range-${range}`}
              value={String(range)}
              aria-label={range.toString()}
            >
              {distance}
            </ToggleButton>
          );
        })}
        <ToggleButton
          key={`range-custom`}
          value={"custom"}
          aria-label={"custom"}
        >
          {t("自訂")}
          {!DEFAULT_SEARCH_RANGE_OPTIONS.includes(searchRange) &&
            `(${searchRange})`}
        </ToggleButton>
      </ToggleButtonGroup>
      <RangeMapDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default SearchRangeController;
