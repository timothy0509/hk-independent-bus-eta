import { Box } from "../ui/box";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { RefObject, useContext, useRef } from "react";
import Draggable from "react-draggable";
import SuccinctTimeReport from "../home/SuccinctTimeReport";
import PinnedEtasContext from "../../context/PinnedEtasContext";
import { Icon } from "../ui/Icon";
import { Minimize2, X, MapPin } from "lucide-react";

const PinDialogContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as RefObject<HTMLDivElement>}
      handle="#draggable-pin-dialog-title"
      cancel='[id*="pin-dialog-irrelavant"]'
      positionOffset={{ x: 0, y: 150 }}
    >
      <div ref={nodeRef} className={cn(className)}>
        {children}
      </div>
    </Draggable>
  );
};

export default function PinDialog() {
  const {
    pinnedEtas,
    isHidden,
    togglePinnedEta,
    tooglePinnedEtasDialog,
    closePinnedEtas,
  } = useContext(PinnedEtasContext);

  if (pinnedEtas.length === 0) {
    return null;
  }

  return (
    <PinDialogContainer className="absolute max-w-screen-sm max-h-[30vh] overflow-y-auto flex flex-col border border-primary bg-background z-50 p-0">
      <Box
        id="draggable-pin-dialog-title"
        className="flex items-center justify-between px-1 py-0.5 bg-background"
      >
        <Box className="flex items-center">
          <Icon icon={MapPin} className="-rotate-45" />
          <Button
            variant="ghost"
            size="sm"
            onClick={tooglePinnedEtasDialog}
            id="pin-dialog-irrelavant-min-icon"
          >
            <Icon icon={Minimize2} />
          </Button>
        </Box>
        <Box className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={closePinnedEtas}
            id="pin-dialog-irrelavant-close-icon"
          >
            <Icon icon={X} />
          </Button>
        </Box>
      </Box>
      <div id="pin-dialog-irrelavant-paper" className="overflow-y-auto">
        {!isHidden &&
          pinnedEtas.map((eta) => (
            <Box
              className="flex items-center shadow-[2px_2px_2px_1px_rgba(0,0,0,0.1)]"
              key={`pinned-${eta}`}
            >
              <SuccinctTimeReport routeId={eta} />
              <Box>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePinnedEta(eta)}
                >
                  <Icon icon={X} />
                </Button>
              </Box>
            </Box>
          ))}
      </div>
    </PinDialogContainer>
  );
}
