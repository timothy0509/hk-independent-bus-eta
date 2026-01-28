import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DbContext from "../../../context/DbContext";
import { useTranslation } from "react-i18next";
import { fetchEstJourneyTime } from "hk-bus-eta";
import { Circle, CircleDot } from "lucide-react";
import useLanguage from "../../../hooks/useTranslation";
import { CircularProgress } from "../../Progress";
import { Input } from "../../ui/input";
import { Box } from "../../ui/box";
import { Icon } from "../../ui/Icon";
import { Typography } from "../../ui/Typography";
import { cn } from "../../../lib/utils";

interface JourneyTimePanelProps {
  routeId: string;
}

interface JourneyTimePanelState {
  isLoading: boolean;
  startSeq: number | null;
  endSeq: number | null;
  jt: number | null;
  choice: "start" | "end";
}

const JourneyTimePanel = ({ routeId }: JourneyTimePanelProps) => {
  const {
    db: { routeList, stopList },
  } = useContext(DbContext);
  const lang = useLanguage();
  const route = routeList[routeId];
  const { t } = useTranslation();
  const [state, setState] = useState<JourneyTimePanelState>(DEFAULT_STATE);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (state.startSeq === null || state.endSeq === null) {
      setState((prev) => ({
        ...prev,
        jt: route.jt !== null ? Math.round(parseFloat(route.jt)) : null,
      }));
      return;
    }
    abortController.current?.abort();
    abortController.current = new AbortController();

    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    fetchEstJourneyTime({
      route,
      startSeq: state.startSeq,
      endSeq: state.endSeq,
      stopList,
      batchSize: Math.max(Math.ceil((state.endSeq - state.startSeq) / 3), 6),
      signal: abortController.current.signal,
    })
      .then((jt) => {
        setState((prev) => ({
          ...prev,
          jt: Math.round(jt),
          isLoading: false,
        }));
      })
      .catch((e) => {
        console.error(e);
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      });
  }, [route, state.endSeq, state.startSeq, stopList]);

  const stops = useMemo(() => {
    return Object.values(route.stops)[0];
  }, [route]);

  const handlePickStop = useCallback(
    (idx: number) => () => {
      setState((prev) => {
        let _startSeq = prev.startSeq;
        let _endSeq = prev.endSeq;
        let _choice = prev.choice;
        if (prev.choice === "start") {
          if (prev.startSeq === idx) _startSeq = null;
          else {
            _startSeq = idx;
          }
          if (_endSeq !== null && idx >= _endSeq) {
            _endSeq = null;
          }
          if (_startSeq !== null && _endSeq === null) _choice = "end";
        } else {
          if (prev.endSeq === idx) _endSeq = null;
          else {
            _endSeq = idx;
          }
          if (_startSeq !== null && idx <= _startSeq) {
            _startSeq = null;
          }
          if (_endSeq !== null && _startSeq === null) _choice = "start";
        }

        return {
          ...prev,
          startSeq: _startSeq,
          endSeq: _endSeq,
          choice: _choice,
        };
      });
    },
    []
  );

  const handlePickChoice = useCallback(
    (choice: JourneyTimePanelState["choice"]) => () => {
      setState((prev) => ({
        ...prev,
        choice,
      }));
    },
    []
  );

  return (
    <Box className="flex flex-col flex-1 pt-1 overflow-hidden">
      <Box className="flex flex-col gap-1 p-1">
        <Box
          className="flex gap-1 cursor-pointer"
          onClick={handlePickChoice("start")}
        >
          <Icon
            icon={state.choice === "start" ? CircleDot : Circle}
            className={cn(
              "w-5 h-5",
              state.choice === "start" ? "text-primary" : ""
            )}
          />
          <Input
            value={
              state.startSeq !== null
                ? stopList[stops[state.startSeq]].name[lang]
                : ""
            }
            className="flex-1 pointer-events-none"
            placeholder={t("起點")}
          />
        </Box>
        <Box
          className="flex gap-1 cursor-pointer"
          onClick={handlePickChoice("end")}
        >
          <Icon
            icon={state.choice === "end" ? CircleDot : Circle}
            className={cn(
              "w-5 h-5",
              state.choice === "end" ? "text-primary" : ""
            )}
          />
          <Input
            value={
              state.endSeq !== null
                ? stopList[stops[state.endSeq]].name[lang]
                : ""
            }
            className="flex-1 pointer-events-none"
            placeholder={t("目的地")}
          />
        </Box>
      </Box>
      <Box className="flex justify-between w-[80%] my-2">
        <Typography variant="subtitle1">{t("車程")}</Typography>
        <Typography variant="subtitle1">
          {state.isLoading ? (
            <CircularProgress size={16} />
          ) : (
            `${state.jt ?? " - "} ${t("分鐘")}`
          )}
        </Typography>
      </Box>
      <div className="w-full my-2 border-b border-border" />
      <div className="flex-1 overflow-auto">
        {stops.map((stop, idx) => (
          <div
            key={stop}
            className={cn(
              "flex items-start gap-2 py-2 px-4 cursor-pointer hover:bg-muted/50",
              isStepActive(idx, state.startSeq, state.endSeq) && "bg-muted/30"
            )}
            onClick={handlePickStop(idx)}
          >
            <StepIcon
              active={isStepActive(idx, state.startSeq, state.endSeq)}
            />
            <span className="text-sm">{stopList[stop].name[lang]}</span>
          </div>
        ))}
      </div>
    </Box>
  );
};

const StepIcon = ({ active }: { active: boolean }) => {
  return (
    <div className="mt-0.5">
      {active ? (
        <Circle className="w-4 h-4 text-primary fill-primary" />
      ) : (
        <Circle className="w-4 h-4 text-muted-foreground" />
      )}
    </div>
  );
};

export default JourneyTimePanel;

const DEFAULT_STATE: JourneyTimePanelState = {
  startSeq: null,
  endSeq: null,
  jt: null,
  choice: "start",
  isLoading: false,
};

const isStepActive = (
  idx: number,
  start: number | null,
  end: number | null
) => {
  if (start === idx || end === idx) return true;
  if (start !== null && end !== null) {
    return start < idx && idx < end;
  }
  return false;
};
