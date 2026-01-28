import { useContext } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import {
  Delete as BackspaceOutlinedIcon,
  XCircle as DoNotDisturbOnOutlinedIcon,
} from "lucide-react";
import AppContext from "../../context/AppContext";
import { type BoardTabType } from "../../@types/types";
import { TRANSPORT_SEARCH_OPTIONS } from "../../constants";
import { RouteList } from "hk-bus-eta";
import DbContext from "../../context/DbContext";

interface KeyButtonProps {
  k: string;
  onClick: (k: string) => void;
  disabled?: boolean;
  className?: string;
}

const KeyButton = ({
  k,
  onClick,
  disabled = false,
  className,
}: KeyButtonProps) => {
  return (
    <Button
      size="lg"
      variant="default"
      className={`w-full text-[1.8em] rounded-none bg-background hover:bg-background text-foreground ${className}`}
      onClick={() => onClick(k)}
      disabled={disabled}
    >
      {k === "b" ? (
        <Icon icon={BackspaceOutlinedIcon} />
      ) : k === "c" ? (
        <Icon icon={DoNotDisturbOnOutlinedIcon} />
      ) : (
        k
      )}
    </Button>
  );
};

const RouteNumPad = ({ possibleChar }: { possibleChar: string[] }) => {
  const { numPadOrder, searchRoute, updateSearchRouteByButton } =
    useContext(AppContext);

  return (
    <div className="grid grid-cols-3 gap-0">
      {numPadOrder.split("").map((k) => (
        <div key={"input-" + k} className="col-span-1">
          <KeyButton
            k={k}
            onClick={updateSearchRouteByButton}
            className="h-[62px]"
            disabled={
              (k === "b" && searchRoute === "") ||
              (!"bc".includes(k) && !possibleChar.includes(k)) ||
              (k === "c" && searchRoute === "")
            }
          />
        </div>
      ))}
    </div>
  );
};

const RouteAlphabetPad = ({ possibleChar }: { possibleChar: string[] }) => {
  const { updateSearchRouteByButton } = useContext(AppContext);

  return (
    <div className="grid grid-cols-2 gap-1">
      {possibleChar
        .filter((k) => isNaN(parseInt(k, 10)))
        .map((k) => (
          <div key={"input-" + k} className="col-span-1">
            <KeyButton
              k={k}
              onClick={updateSearchRouteByButton}
              className="h-[52px]"
            />
          </div>
        ))}
    </div>
  );
};

const RouteInputPad = ({ boardTab }: { boardTab: BoardTabType }) => {
  const { searchRoute } = useContext(AppContext);
  const {
    db: { routeList },
  } = useContext(DbContext);

  const possibleChar = getPossibleChar(searchRoute, routeList, boardTab);

  if (navigator.userAgent === "prerendering") {
    return <></>;
  }

  return (
    <div className="z-0 bg-background flex flex-row h-[248px] min-h-[62px] justify-around overflow-hidden p-0">
      <div className="w-[62%] h-auto overflow-x-hidden overflow-y-scroll p-0">
        <RouteNumPad possibleChar={possibleChar} />
      </div>
      <div className="w-[35%] h-auto overflow-x-hidden overflow-y-scroll p-0">
        <RouteAlphabetPad possibleChar={possibleChar} />
      </div>
    </div>
  );
};

export default RouteInputPad;

const getPossibleChar = (
  searchRoute: string,
  routeList: RouteList,
  boardTab: BoardTabType
) => {
  if (routeList == null) return [];
  let possibleChar: Record<string, number> = {};
  Object.entries(routeList).forEach(([routeNo, meta]) => {
    if (
      routeNo.startsWith(searchRoute.toUpperCase()) &&
      meta["co"].some((c) =>
        TRANSPORT_SEARCH_OPTIONS[boardTab as BoardTabType].includes(c)
      )
    ) {
      let c = routeNo.slice(searchRoute.length, searchRoute.length + 1);
      possibleChar[c] = isNaN(possibleChar[c]) ? 1 : possibleChar[c] + 1;
    }
  });
  return Object.entries(possibleChar)
    .map((k) => k[0])
    .filter((k) => k !== "-");
};
