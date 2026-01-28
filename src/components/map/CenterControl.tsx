import React from "react";
import { MapPin } from "lucide-react";

interface CenterControlProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const CenterControl = ({ onClick }: CenterControlProps) => {
  return (
    <div className="leaflet-bottom leaflet-right">
      <div
        className="leaflet-control leaflet-bar flex h-8 w-8 cursor-pointer items-center justify-center bg-white !mb-5 !mr-1"
        onClick={onClick}
      >
        <MapPin className="p-[2px] text-black" />
      </div>
    </div>
  );
};

export default CenterControl;
