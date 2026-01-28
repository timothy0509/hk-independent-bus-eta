import { useCallback, useContext, useMemo, useState } from "react";
import { Box } from "../../ui/box";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";
import { Icon } from "../../ui/Icon";
import CollectionSchedule from "./CollectionSchedule";
import CollectionRoute from "./CollectionRoute";
import CollectionContext from "../../../CollectionContext";
import { Dialog, DialogContent, DialogHeader } from "../../ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Input } from "../../ui/input";
import { RouteCollection } from "../../../@types/types";
import { Trash2 } from "lucide-react";

const CollectionDialog = () => {
  const { t } = useTranslation();
  const {
    collections,
    collectionIdx,
    toggleCollectionDialog,
    updateCollectionName,
    removeCollection,
    savedEtas,
  } = useContext(CollectionContext);

  const collection: RouteCollection = useMemo(() => {
    if (collectionIdx !== null && collectionIdx >= 0) {
      return collections[collectionIdx];
    }
    return {
      name: "常用",
      list: savedEtas,
      schedules: [],
    };
  }, [collections, collectionIdx, savedEtas]);

  const [tab, changeTab] = useState<"time" | "routes">("routes");

  const handleCollectionRemoval = useCallback(() => {
    if (
      collectionIdx !== null &&
      window.confirm(t("確定刪除 ") + collection.name + "?")
    ) {
      removeCollection(collectionIdx);
    }
  }, [removeCollection, collectionIdx, collection, t]);

  if (collectionIdx === null || collection === undefined) {
    return null;
  }

  return (
    <Dialog
      open={collectionIdx !== null}
      onOpenChange={(open: boolean) => {
        if (!open) toggleCollectionDialog(null);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex w-full items-center justify-between pb-2">
            <Input
              id="collection-input"
              value={collection.name}
              onChange={({ target: { value } }) => updateCollectionName(value)}
              disabled={collectionIdx === -1}
              className="flex-1"
            />
            {collectionIdx !== -1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCollectionRemoval}
                className="ml-2 opacity-30 hover:opacity-100"
              >
                <Icon icon={Trash2} />
              </Button>
            )}
          </div>
          <Tabs
            value={tab}
            onValueChange={(value: any) => changeTab(value)}
            className="w-full"
          >
            <TabsList className="h-9 min-h-8 bg-muted">
              <TabsTrigger value="routes" className="min-h-8">
                {t("路線")}
              </TabsTrigger>
              <TabsTrigger value="time" className="min-h-8">
                {t("顯示時間")}
              </TabsTrigger>
            </TabsList>
            <Box className="h-[50vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
              {tab === "routes" && <CollectionRoute />}
              {tab === "time" && <CollectionSchedule />}
            </Box>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDialog;
