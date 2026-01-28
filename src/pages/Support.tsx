import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useTranslation } from "react-i18next";
import { Send, Mail, Instagram, Twitter } from "lucide-react";

const Support = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center flex flex-col overflow-auto w-full flex-1 gap-5 bg-background">
      <div className="flex-1">
        <SettingItem
          icon={<Send className="h-5 w-5" />}
          primary={t("Telegram 交流區")}
          secondary={"https://t.me/+T245uB32DeNlNjJl"}
          href="https://t.me/+T245uB32DeNlNjJl"
        />
        <SettingItem
          icon={<Mail className="h-5 w-5" />}
          primary={t("Email")}
          secondary={"info@hkbus.app"}
          href="mailto:info@hkbus.app"
        />
        <SettingItem
          icon={<Instagram className="h-5 w-5" />}
          primary={t("Instagram")}
          secondary={"@hkbus.app"}
          href="https://instagram.com/hkbus.app"
        />
        <SettingItem
          icon={<Twitter className="h-5 w-5" />}
          primary={t("Twitter")}
          secondary={"@hkbus.app"}
          href="https://twitter.com/hkbusApp"
        />
      </div>
      <p className="text-sm">{t("歡迎意見及技術交流")}</p>
    </div>
  );
};

export default Support;

interface SettingItemProps {
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  href: string;
}

const SettingItem = ({ icon, primary, secondary, href }: SettingItemProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
    >
      <Avatar>
        <AvatarFallback>{icon}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium">{primary}</p>
        <p className="text-sm text-muted-foreground">{secondary}</p>
      </div>
    </a>
  );
};
