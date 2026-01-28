import { Box } from "../ui/box";
import { CircularProgress } from "../ui/circular-progress";
import SuccinctTimeReport from "../home/SuccinctTimeReport";
import { useStopEtas } from "../../hooks/useStopEtas";
import { Company } from "hk-bus-eta";

interface StopRouteListProps {
  stops: Array<[Company, string]>; // [[co, stopId]]
  isFocus: boolean;
}

const StopRouteList = ({ stops, isFocus }: StopRouteListProps) => {
  const stopEtas = useStopEtas({ stopKeys: stops, disabled: !isFocus });

  if (stopEtas.length === 0) {
    return (
      <Box className="flex flex-1 justify-center">
        <CircularProgress className="my-5" />
      </Box>
    );
  }

  return (
    <div>
      {stopEtas.map(([route, etas]) => (
        <SuccinctTimeReport key={route} routeId={route} etas={etas} />
      ))}
    </div>
  );
};

export default StopRouteList;
