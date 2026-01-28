import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { Box } from "../ui/box";
import { Sheet, SheetContent } from "../ui/sheet";
import Collection from "./collections/Collection";
import WatchEntry from "./collections/WatchEntry";
import CollectionContext from "../../CollectionContext";
import { Maximize2, Plus } from "lucide-react";

declare global {
  interface Window {
    harmonyBridger?: any;
  }
}

const CollectionDrawer = () => {
  const { t } = useTranslation();
  const {
    collectionDrawerRoute,
    setCollectionDrawerRoute,
    savedEtas,
    collections,
    addNewCollection,
  } = useContext(CollectionContext);

  return (
    <Sheet
      open={collectionDrawerRoute !== null}
      onOpenChange={(open: boolean) => {
        if (!open) setCollectionDrawerRoute(null);
      }}
    >
      <SheetContent side="bottom">
        <div className="rounded-t-xl max-h-[50vh] min-h-[30vh] flex flex-col px-2 py-1">
          <Box className="flex flex-col max-h-[50vh] min-h-[30vh] px-2 py-1">
            <Icon
              icon={Maximize2}
              className="self-center text-muted-foreground"
            />
            {typeof window.harmonyBridger === "undefined" && (
              <Box className="mb-1 flex">
                <WatchEntry />
              </Box>
            )}

            <Box className="mb-1 flex">
              <Collection
                name={t("常用")}
                list={savedEtas}
                collectionIdx={-1}
              />
            </Box>
            <Box className="flex items-center justify-between">
              <div className="text-base font-semibold">{t("Collections")}</div>
              <Button variant="ghost" size="icon" onClick={addNewCollection}>
                <Icon icon={Plus} />
              </Button>
            </Box>
            <Box className="flex flex-col gap-2 overflow-y-auto">
              {collections.map(({ name, list }, idx) => (
                <Collection
                  key={`collection-${idx}`}
                  name={name}
                  list={list}
                  collectionIdx={idx}
                />
              ))}
            </Box>
          </Box>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CollectionDrawer;
