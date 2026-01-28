import { useContext } from "react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Checkbox } from "../../ui/checkbox";
import { Box } from "../../ui/box";
import { Typography } from "../../ui/Typography";
import { useTranslation } from "react-i18next";
import DbContext from "../../../context/DbContext";
import CollectionContext from "../../../CollectionContext";

interface CollectionProps {
  name: string;
  list: string[];
  collectionIdx: number;
}

const Collection = ({ name, list, collectionIdx }: CollectionProps) => {
  const { t } = useTranslation();
  const {
    db: { routeList },
  } = useContext(DbContext);
  const { collectionDrawerRoute, toggleCollectionDialog, toggleCollectionEta } =
    useContext(CollectionContext);

  return (
    <Box className="flex flex-1 justify-between">
      <Box
        className="flex flex-1 cursor-pointer items-center gap-2"
        onClick={() => toggleCollectionDialog(collectionIdx)}
      >
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Box className="flex flex-col">
          <Typography variant="body1">{name}</Typography>
          <Typography variant="caption">
            {t("Number of ETAs: ")}
            {
              list.filter((r) => routeList[r.split("/")[0]] !== undefined)
                .length
            }
          </Typography>
        </Box>
      </Box>
      <Box className="flex">
        <Checkbox
          checked={list.includes(collectionDrawerRoute ?? "")}
          onClick={() => {
            if (collectionDrawerRoute && collectionIdx !== null) {
              toggleCollectionEta(collectionDrawerRoute, collectionIdx);
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Collection;
