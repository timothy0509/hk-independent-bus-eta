import { useContext } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Star as StarIcon, StarOff as StarOutlinedIcon } from "lucide-react";
import CollectionContext from "../../CollectionContext";

interface RouteStarButtonProps {
  routeId: string;
}

const RouteStarButton = ({ routeId }: RouteStarButtonProps) => {
  const { savedEtas, setCollectionDrawerRoute } = useContext(CollectionContext);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        const targetRouteId = `${routeId.toUpperCase()}`;
        setCollectionDrawerRoute(targetRouteId);
      }}
      className="flex flex-col justify-center"
    >
      <Icon icon={savedEtas.includes(routeId) ? StarIcon : StarOutlinedIcon} />
    </Button>
  );
};

export default RouteStarButton;
