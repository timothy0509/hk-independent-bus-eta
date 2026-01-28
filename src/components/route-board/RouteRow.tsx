import React, { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import RouteTerminus from "./RouteTerminus";
import RouteNoCompany from "./RouteNoCompany";
import { Icon } from "../ui/Icon";
import { X as CloseIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { RouteListEntry } from "hk-bus-eta";
import useLanguage from "../../hooks/useTranslation";

interface RouteRowProps {
  route: [string, RouteListEntry];
  style: React.CSSProperties;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
}

const RouteRow = ({ route, onClick, style, onRemove }: RouteRowProps) => {
  const language = useLanguage();

  return (
    <Link
      // for SEO, not for click
      to={`/${language}/route/${route[0].toLowerCase()}`}
      style={style}
      className={cn(
        "flex items-center h-full border-b border-solid",
        "dark:border-neutral-900 border-slate-200"
      )}
    >
      <button
        onClick={onClick}
        className="w-full grid grid-cols-[25%_65%] py-0.5 px-2 items-center"
      >
        <RouteNoCompany route={route} />
        <RouteTerminus terminus={route[1]} />
      </button>
      {onRemove && (
        <button onClick={onRemove}>
          <Icon icon={CloseIcon} />
        </button>
      )}
    </Link>
  );
};

export default RouteRow;
