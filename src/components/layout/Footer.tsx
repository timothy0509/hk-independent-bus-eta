import React, { useCallback, useContext, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "../ui/Icon";
import { cn } from "../../lib/utils";
import AppContext from "../../context/AppContext";
import { vibrate } from "../../utils";
import EmotionContext from "../../context/EmotionContext";
import useLanguage from "../../hooks/useTranslation";
import { Home, Search, Navigation, Flag, Newspaper, Heart } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  const language = useLanguage();
  const location = useLocation();
  const { vibrateDuration } = useContext(AppContext);
  const { isRemind } = useContext(EmotionContext);

  const navigate = useNavigate();
  const handleClick = useCallback(
    (link: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      vibrate(vibrateDuration);
      setTimeout(() => navigate(link), 0);
    },
    [vibrateDuration, navigate]
  );

  const currentPath = location.pathname.replace(/(.*)\/[0-9]*?$/, "$1");

  const navItems = useMemo(
    () => [
      {
        label: t("首頁"),
        to: `/${language}`,
        value: `/${language}`,
        icon: Home,
      },
      {
        label: t("車站"),
        to: `/${language}/stops`,
        value: `/${language}/stops`,
        icon: Flag,
      },
      {
        label: t("搜尋"),
        to: `/${language}/board`,
        value: `/${language}/board`,
        icon: Search,
      },
      {
        label: t("規劃"),
        to: `/${language}/search`,
        value: `/${language}/search`,
        icon: Navigation,
      },
      {
        label: t("通告"),
        to: `/${language}/notice`,
        value: `/${language}/notice`,
        icon: Newspaper,
      },
      {
        label: t("Heart"),
        to: `/${language}/emotion`,
        value: `/${language}/emotion`,
        icon: Heart,
        hasBadge: isRemind,
      },
    ],
    [language, t, isRemind]
  );

  return (
    <nav className="fixed bottom-0 w-full bg-background">
      <div className="flex items-center justify-center gap-0">
        {navItems.map((item) => {
          const isActive = currentPath === item.value;
          return (
            <Link
              key={item.value}
              to={item.to}
              onClick={(e) => handleClick(item.to, e)}
              rel="nofollow"
              className={cn(
                "flex w-[20%] flex-col items-center justify-center px-0 py-1.5 text-sm transition-colors",
                isActive
                  ? "text-primary dark:text-primary"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon icon={item.icon} size={20} />
                {item.hasBadge && !currentPath.endsWith("/emotion") && (
                  <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
                  </span>
                )}
              </div>
              <span className="mt-0.5 text-[0.875rem]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Footer;
