import SuccinctTimeReport from "../SuccinctTimeReport";
import { useMemo, useState } from "react";
import { Icon } from "../../ui/Icon";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Typography } from "../../ui/Typography";

interface HomeRouteListDropDownProps {
  name: string;
  routeStrings: string;
  defaultExpanded?: boolean;
}

const HomeRouteListDropDown = ({
  name,
  routeStrings,
  defaultExpanded = true,
}: HomeRouteListDropDownProps) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  const routes = useMemo(
    () => routeStrings.split("|").filter((v) => v) ?? [],
    [routeStrings]
  );
  if (routes.length === 0) {
    return <></>;
  }
  return (
    <>
      <div
        className="flex items-center justify-between mx-1 cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Typography variant="body1" className="m-1 font-bold">
          {name}
        </Typography>
        <div>
          <Icon icon={expanded ? ChevronUp : ChevronDown} />
        </div>
      </div>
      <div className="border-b border-border" />
      {expanded && (
        <div>
          {routes.map(
            (selectedRoute, idx) =>
              Boolean(selectedRoute) && (
                <SuccinctTimeReport
                  key={`route-${name}-${idx}`}
                  routeId={selectedRoute}
                />
              )
          )}
        </div>
      )}
      <div className="border-b border-border" />
    </>
  );
};

export default HomeRouteListDropDown;
