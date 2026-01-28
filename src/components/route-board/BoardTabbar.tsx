import { useContext } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useTranslation } from "react-i18next";

import { TRANSPORT_SEARCH_OPTIONS } from "../../constants";
import AppContext from "../../context/AppContext";
import { BoardTabType } from "../../@types/types";
import { useHorizontalWheelScroll } from "../../hooks/useHorizontalWheelScroll";

interface BoardTabbarProps {
  boardTab: BoardTabType;
  onChangeTab: (v: BoardTabType, rerenderList: boolean) => void;
}

const BoardTabbar = ({ boardTab, onChangeTab }: BoardTabbarProps) => {
  const { t } = useTranslation();
  const { isRecentSearchShown } = useContext(AppContext);
  useHorizontalWheelScroll();

  return (
    <Tabs
      value={boardTab}
      onValueChange={(v) => onChangeTab(v as BoardTabType, true)}
    >
      <TabsList className="min-h-[36px] bg-background overflow-auto max-w-full w-full">
        {Object.keys(TRANSPORT_SEARCH_OPTIONS)
          .filter((option) => isRecentSearchShown || option !== "recent")
          .map((option) => (
            <TabsTrigger
              key={option}
              className="py-0 min-w-[85px] min-h-[32px] data-[state=active]:bg-muted"
              value={option}
            >
              {t(option)}
            </TabsTrigger>
          ))}
      </TabsList>
    </Tabs>
  );
};

export default BoardTabbar;

export const isBoardTab = (
  input: unknown,
  isRecentSearchShown: boolean
): input is BoardTabType => {
  return (
    (isRecentSearchShown && input === "recent") ||
    input === "all" ||
    input === "bus" ||
    input === "minibus" ||
    input === "lightRail" ||
    input === "mtr" ||
    input === "ferry"
  );
};
