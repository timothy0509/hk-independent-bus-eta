import { Compass } from "lucide-react";
import { isSafari, requestPermission } from "react-world-compass";
import { useCallback, useContext } from "react";
import AppContext from "../../context/AppContext";

const CompassControl = () => {
  const { compassPermission, setCompassPermission } = useContext(AppContext);
  const handleClick = useCallback(() => {
    requestPermission().then((r) => {
      setCompassPermission(r);
    });
  }, [setCompassPermission]);

  if (!isSafari || compassPermission === "granted") {
    return <></>;
  }

  return (
    <div className="leaflet-bottom leaflet-right">
      <div
        className="leaflet-control leaflet-bar flex h-8 w-8 cursor-pointer items-center justify-center bg-white !mb-[57px] !mr-1"
        onClick={handleClick}
      >
        <Compass className="p-[3px] text-black" />
      </div>
    </div>
  );
};

export default CompassControl;
