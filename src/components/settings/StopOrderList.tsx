import { useState, useContext, useCallback } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import Droppable from "../StrictModeDroppable";
import { Button } from "../ui/Button";
import { reorder } from "../../utils";
import { useTranslation } from "react-i18next";
import { Trash2, GripVertical } from "lucide-react";
import { Icon } from "../ui/Icon";
import { ManageMode } from "../../data";
import useLanguage from "../../hooks/useTranslation";
import DbContext from "../../context/DbContext";
import CollectionContext from "../../CollectionContext";
import { cn } from "../../lib/utils";

const StopOrderList = ({ mode }: { mode: ManageMode }) => {
  const {
    db: { stopList },
  } = useContext(DbContext);
  const { savedStops, setSavedStops, updateSavedStops } =
    useContext(CollectionContext);
  const [items, setItems] = useState(
    savedStops.filter((id) => id.split("|")[1] in stopList)
  );
  const { t } = useTranslation();

  const handleDragEnd = useCallback(
    ({ destination, source }: DropResult) => {
      if (!destination) return;

      const newItems = reorder(items, source.index, destination.index);

      setItems(newItems);
      setSavedStops(Array.from(newItems));
    },
    [items, setItems, setSavedStops]
  );

  const handleDelete = useCallback(
    (stop: string) => () => {
      updateSavedStops(stop);
      setItems((prev) => prev.filter((v) => v !== stop));
    },
    [updateSavedStops]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="saved-stop-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-1 overflow-y-auto"
          >
            {items.length ? (
              items.map((stop, index) => (
                <DraggableListItem
                  item={stop}
                  index={index}
                  key={`savedStop-${stop}`}
                  mode={mode}
                  onDelete={handleDelete(stop)}
                />
              ))
            ) : (
              <div className="text-center mt-5">
                <b>{t("未有收藏車站")}</b>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default StopOrderList;

interface DraggableListItemProps {
  item: string;
  index: number;
  mode: ManageMode;
  onDelete: () => void;
}

const DraggableListItem = ({
  item,
  index,
  mode,
  onDelete,
}: DraggableListItemProps) => {
  const {
    db: { stopList },
  } = useContext(DbContext);
  const [, stopId] = item.split("|");
  const language = useLanguage();

  return (
    <Draggable
      draggableId={item}
      index={index}
      isDragDisabled={mode !== "order"}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "px-2 py-2 flex justify-between items-center",
            "shadow-[2px_2px_2px_1px_rgba(0,0,0,0.1)]"
          )}
        >
          <div>
            <p className="text-sm font-medium">
              {stopList[stopId]?.name[language]}
            </p>
          </div>
          {mode === "order" && <Icon icon={GripVertical} size={20} />}
          {mode === "edit" && (
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Icon icon={Trash2} size={18} />
            </Button>
          )}
        </div>
      )}
    </Draggable>
  );
};
