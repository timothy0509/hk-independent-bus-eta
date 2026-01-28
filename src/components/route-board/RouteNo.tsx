import { Typography } from "../ui/Typography";
import { cn } from "../../lib/utils";

interface RouteNoProps {
  routeNo: string;
  component?: any;
  align?: "right" | "left" | "inherit" | "center" | "justify";
  fontSize?: string;
}

const RouteNo = ({ routeNo, component, align, fontSize }: RouteNoProps) => {
  // Suffix Examples: 962X=> X, 44A1 => A1, 25MS => MS, AEL => "", NA29 => ""
  let splitIdx = routeNo.length;
  for (let i = 1; i < routeNo.length; ++i) {
    if (
      "0" <= routeNo[i - 1] &&
      routeNo[i - 1] <= "9" &&
      "A" <= routeNo[i] &&
      routeNo[i] <= "Z"
    ) {
      splitIdx = i;
      break;
    }
  }
  const prefix = routeNo.slice(0, splitIdx);
  const suffix = routeNo.slice(splitIdx);

  const fontSizeStyle = fontSize || "1.5rem";

  return (
    <Typography
      component={component || "h2"}
      variant="caption"
      className="leading-normal inline whitespace-nowrap"
      style={{ textAlign: align }}
    >
      <span
        className={cn("block font-['Oswald',sans-serif]")}
        style={{ fontSize: fontSizeStyle }}
      >
        {prefix}
      </span>
      <span
        className="block font-['Oswald',sans-serif]"
        style={{ fontSize: "1.2rem" }}
      >
        {suffix}
      </span>
    </Typography>
  );
};

export default RouteNo;
