import { useState } from "react";
import { Button } from "../ui/Button";
import { Code, Trash2, Edit3 } from "lucide-react";
import { Icon } from "../ui/Icon";
import { useTranslation } from "react-i18next";
import CollectionOrderList from "./CollectionOrderList";
import StopOrderList from "./StopOrderList";
import { ManageMode } from "../../data";

type TAB = "savedOrder" | "collectionOrder" | "stopOrder";

const UserContentManagement = () => {
  const [tab, setTab] = useState<TAB>("collectionOrder");
  const [mode, setMode] = useState<ManageMode>("order");
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col px-1 overflow-hidden">
      <div className="flex items-center justify-between py-1">
        <div className="flex gap-2">
          <Button
            variant={tab === "collectionOrder" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("collectionOrder")}
          >
            {t("路線收藏")}
          </Button>
          <Button
            variant={tab === "stopOrder" ? "default" : "ghost"}
            size="sm"
            onClick={() => setTab("stopOrder")}
          >
            {t("車站")}
          </Button>
        </div>
        <div className="flex gap-1">
          <Button
            variant={mode === "order" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("order")}
          >
            <Icon icon={Code} size={16} className="rotate-90" />
          </Button>
          <Button
            variant={mode === "edit" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("edit")}
          >
            {tab !== "collectionOrder" && <Icon icon={Trash2} size={16} />}
            {tab === "collectionOrder" && <Icon icon={Edit3} size={16} />}
          </Button>
        </div>
      </div>
      {tab === "collectionOrder" && <CollectionOrderList mode={mode} />}
      {tab === "stopOrder" && <StopOrderList mode={mode} />}
    </div>
  );
};

export default UserContentManagement;
