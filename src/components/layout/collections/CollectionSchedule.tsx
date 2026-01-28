import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "../../ui/box";
import { Button } from "../../ui/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker as TimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Icon } from "../../ui/Icon";
import dayjs from "dayjs";
import CollectionContext from "../../../CollectionContext";
import { PlusCircle, MinusCircle } from "lucide-react";

const CollectionSchedule = () => {
  const { t } = useTranslation();
  const {
    collections,
    collectionIdx,
    updateCollectionSchedule,
    addCollectionSchedule,
    removeCollectionSchedule,
    savedEtas,
  } = useContext(CollectionContext);

  const [newCollection, setNewCollection] = useState([
    {
      name: t("常用"),
      list: savedEtas,
      schedules: [],
    },
    ...collections,
  ]);

  const newCollectionIdx = useMemo(
    () => (collectionIdx !== null ? collectionIdx + 1 : null),
    [collectionIdx]
  );

  useEffect(() => {
    setNewCollection([
      {
        name: t("常用"),
        list: savedEtas,
        schedules: [],
      },
      ...collections,
    ]);
  }, [collections, savedEtas, t]);

  if (newCollectionIdx === null) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex flex-col gap-1.5 text-center text-[0.8em]">
        {newCollection[newCollectionIdx].schedules.length > 0 ? (
          <>
            {newCollection[newCollectionIdx].schedules.map(
              (daySchedule, idx) => (
                <Box
                  key={`schedule-${idx}`}
                  className="flex items-center justify-between gap-0.5"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCollectionSchedule(idx)}
                  >
                    <Icon icon={MinusCircle} />
                  </Button>
                  <select
                    value={daySchedule.day}
                    onChange={({ target: { value } }) =>
                      updateCollectionSchedule(idx, "day", parseInt(value))
                    }
                    className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {[...Array(7).keys(), -1]
                      .map((i) => (i === -1 ? -1 : (i + 1) % 7))
                      .map((_weekday) => (
                        <option
                          key={`option-${idx}-${_weekday}`}
                          value={_weekday}
                        >
                          {_weekday === -1
                            ? t("public-holiday")
                            : t(`weekday-${_weekday}`)}
                        </option>
                      ))}
                  </select>
                  <TimePicker
                    className="flex-[0.45]"
                    slotProps={{
                      textField: {
                        size: "small",
                        variant: "standard",
                      },
                    }}
                    value={dayjs(
                      `1991-12-02${daySchedule.start.hour}:${daySchedule.start.minute}`
                    )}
                    onChange={(v: any) =>
                      updateCollectionSchedule(idx, "start", {
                        hour: v.$H,
                        minute: v.$m,
                      })
                    }
                  />
                  <span className="px-1">-</span>
                  <TimePicker
                    className="flex-[0.45]"
                    slotProps={{
                      textField: {
                        size: "small",
                        variant: "standard",
                      },
                    }}
                    value={dayjs(
                      `1991-12-02T${daySchedule.end.hour}:${daySchedule.end.minute}`
                    )}
                    onChange={(v: any) =>
                      updateCollectionSchedule(idx, "end", {
                        hour: v.$H,
                        minute: v.$m,
                      })
                    }
                  />
                </Box>
              )
            )}
          </>
        ) : (
          <p className="mt-5 text-sm font-bold">{t("missing_schedule")}</p>
        )}

        <Button onClick={() => addCollectionSchedule()} variant="ghost">
          <Icon icon={PlusCircle} />
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default CollectionSchedule;
