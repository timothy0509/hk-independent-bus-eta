import { useContext, useCallback, useMemo } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import { Button } from "../ui/Button";
import { reorder } from "../../utils";
import { useTranslation } from "react-i18next";
import { GripVertical, Edit3 } from "lucide-react";
import { Icon } from "../ui/Icon";
import Droppable from "../StrictModeDroppable";
import { ManageMode } from "../../data";
import CollectionContext from "../../CollectionContext";
import type { RouteCollection } from "../../@types/types";
import { cn } from "../../lib/utils";

const CollectionOrderList = ({ mode }: { mode: ManageMode }) => {
  const { t } = useTranslation();
  const { collections, setCollections, toggleCollectionDialog, savedEtas } =
    useContext(CollectionContext);
  const items = useMemo(() => collections, [collections]);

  const handleDragEnd = useCallback(
    ({ destination, source }: DropResult) => {
      if (!destination) return;

      const newItems = reorder(items, source.index, destination.index);
      setCollections(newItems);
    },
    [items, setCollections]
  );

  const handleEdit = useCallback(
    (idx: number) => {
      toggleCollectionDialog(idx);
    },
    [toggleCollectionDialog]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="saved-eta-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-1 overflow-y-auto"
          >
            {mode === "edit" && (
              <DraggableListItem
                item={{ name: "常用", list: savedEtas, schedules: [] }}
                index={-1}
                mode={mode}
                onEdit={() => handleEdit(-1)}
              />
            )}
            {collections.length ? (
              items.map((item, index) => (
                <DraggableListItem
                  item={item}
                  index={index}
                  key={`collection-${item.name}`}
                  mode={mode}
                  onEdit={() => handleEdit(index)}
                />
              ))
            ) : (
              <div className="text-center mt-5">
                <b>{t("未有收藏。")}</b>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CollectionOrderList;

interface DraggableListItemProps {
  item: RouteCollection;
  index: number;
  mode: ManageMode;
  onEdit: () => void;
}

const DraggableListItem = ({
  item: { name, list },
  index,
  mode,
  onEdit,
}: DraggableListItemProps) => {
  const { t } = useTranslation();
  return (
    <Draggable
      draggableId={name}
      index={index}
      isDragDisabled={mode !== "order"}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "px-2 py-1 flex justify-between items-center",
            "shadow-[2px_2px_2px_1px_rgba(0,0,0,0.1)]"
          )}
        >
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">
              {t("Number of ETAs: ")}
              {list.length}
            </p>
          </div>
          {mode === "order" && <Icon icon={GripVertical} size={20} />}
          {mode === "edit" && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Icon icon={Edit3} size={18} />
            </Button>
          )}
        </div>
      )}
    </Draggable>
  );
};
