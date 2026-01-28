import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/Button";
import { Separator } from "../ui/separator";
import { ArrowLeft, X } from "lucide-react";
import { Icon } from "../ui/Icon";
import { useTranslation } from "react-i18next";
import OptionsList from "./OptionsList";
import UserContentManagement from "./UserContentManagement";

interface PersonalizeModalProps {
  open: boolean;
  onClose: () => void;
}

type TabType = "options" | "manage";

const PersonalizeDialog = ({ open, onClose }: PersonalizeModalProps) => {
  const [tab, setTab] = useState<TabType>("options");
  const { t } = useTranslation();

  const handleClose = () => {
    onClose();
    setTab("options");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="h-full max-w-sm">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            {tab !== "options" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTab("options")}
              >
                <Icon icon={ArrowLeft} size={18} />
              </Button>
            )}
            <DialogTitle className="text-base font-semibold">
              {t(tab === "options" ? "個性化設定" : "")}
              {t(tab === "manage" ? "管理收藏" : "")}
            </DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon icon={X} size={18} />
          </Button>
        </DialogHeader>
        <Separator />
        {tab === "options" && (
          <OptionsList goToManage={() => setTab("manage")} />
        )}
        {tab === "manage" && <UserContentManagement />}
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizeDialog;
