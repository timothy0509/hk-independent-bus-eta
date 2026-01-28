import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/Button";
import { Share, MoreVertical } from "lucide-react";
import { Icon } from "../ui/Icon";
import { useTranslation } from "react-i18next";

interface InstallDialogProps {
  open: boolean;
  handleClose: () => void;
}

const InstallDialog = ({ open, handleClose }: InstallDialogProps) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"PWA" | "App">("App");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>{t("安裝步驟")}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 border-b pb-4 mb-4">
          <Button
            variant={tab === "App" ? "default" : "outline"}
            onClick={() => setTab("App")}
          >
            App
          </Button>
          <Button
            variant={tab === "PWA" ? "default" : "outline"}
            onClick={() => setTab("PWA")}
          >
            PWA
          </Button>
        </div>
        {tab === "App" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              className="w-[120px] cursor-pointer"
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=app.hkbus"
                )
              }
            >
              <img
                src="/img/google-play-badge.png"
                alt="Install via Google Play"
                className="w-full"
              />
            </div>
            <div
              className="w-[120px] cursor-pointer"
              onClick={() =>
                window.open(
                  "https://apps.apple.com/hk/app/%E5%B7%B4%E5%A3%AB%E5%88%B0%E7%AB%99%E9%A0%90%E5%A0%B1-hkbus-app/id1612184906"
                )
              }
            >
              <img
                src="/img/app-store.svg"
                className="w-full"
                alt="Install via App Store"
              />
            </div>
          </div>
        )}
        {tab === "PWA" && (
          <>
            <div className="py-2">
              <h5 className="text-lg font-semibold mb-2">iOS:</h5>
              <p className="text-sm">1. {t("用 Safari 開")}</p>
              <p className="text-sm flex items-center gap-1">
                2. {t("分享")}
                <Icon icon={Share} size={18} />
              </p>
              <p className="text-sm">3. {t("加至主畫面")}</p>
            </div>
            <div className="py-2 border-t pt-4">
              <h5 className="text-lg font-semibold mb-2">Android:</h5>
              <p className="text-sm">1. {t("用 Chrome 開")}</p>
              <p className="text-sm flex items-center gap-1">
                2. {t("右上選項")}
                <Icon icon={MoreVertical} size={18} />
              </p>
              <p className="text-sm">3. {t("新增至主畫面 / 安裝應用程式")}</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InstallDialog;
