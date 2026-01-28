import React, { useState, useContext, useCallback } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import Droppable from "../StrictModeDroppable";
import SuccinctTimeReport from "../home/SuccinctTimeReport";
import { reorder } from "../../utils";
import { useTranslation } from "react-i18next";
import { ManageMode } from "../../data";
import DbContext from "../../context/DbContext";
import CollectionContext from "../../CollectionContext";
import { cn } from "../../lib/utils";

const SavedEtaList = ({ mode }: { mode: ManageMode }) => {
  const {
    db: { routeList },
  } = useContext(DbContext);
  const { savedEtas, setSavedEtas, updateSavedEtas } =
    useContext(CollectionContext);
  const [items, setItems] = useState(
    savedEtas.filter((id) => id.split("/")[0] in routeList).reverse()
  );
  const { t } = useTranslation();

  const handleDragEnd = useCallback(
    ({ destination, source }: DropResult) => {
      if (!destination) return;

      const newItems = reorder(items, source.index, destination.index);

      setItems(newItems);
      setSavedEtas(Array.from(newItems).reverse());
    },
    [items, setSavedEtas]
  );

  const handleDelete = useCallback(
    (eta: string) => {
      updateSavedEtas(eta);
      setItems((prev) => prev.filter((v) => v !== eta));
    },
    [updateSavedEtas]
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
            {items.length ? (
              items.map((eta, index) => (
                <React.Fragment key={`savedEta-${eta}`}>
                  <DraggableListItem
                    item={eta}
                    index={index}
                    mode={mode}
                    onDelete={() => handleDelete(eta)}
                  />
                </React.Fragment>
              ))
            ) : (
              <div className="text-center mt-5">
                <b>{t("未有收藏路線")}</b>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SavedEtaList;

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
}: DraggableListItemProps) => (
  <Draggable draggableId={item} index={index} isDragDisabled={mode !== "order"}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={cn(
          "px-2 py-1 flex",
          "shadow-[2px_2px_2px_1px_rgba(0,0,0,0.1)]"
        )}
      >
        <SuccinctTimeReport routeId={item} mode={mode} onDelete={onDelete} />
      </div>
    )}
  </Draggable>
);
