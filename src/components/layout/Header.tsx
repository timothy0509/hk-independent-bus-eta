import { useEffect, useCallback, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Icon } from "../ui/Icon";
import { Button } from "../ui/Button";
import { Box } from "../ui/box";
import { Typography } from "../ui/Typography";
import AppContext from "../../context/AppContext";
import { vibrate, checkMobile } from "../../utils";
import { useWeatherCode, WeatherIcons } from "../Weather";
import useOnline from "../../hooks/useOnline";
import useLanguage from "../../hooks/useTranslation";
import DbContext from "../../context/DbContext";
import {
  Settings,
  Monitor,
  Sun,
  Moon,
  WifiOff,
  Search,
  MapPin,
} from "lucide-react";

const Header = () => {
  const {
    searchRoute,
    setSearchRoute,
    vibrateDuration,
    geoPermission,
    updateGeolocation,
    changeLanguage,
    _colorMode,
    toggleColorMode,
    isSearching,
    setIsSearching,
    openUrl,
  } = useContext(AppContext);
  const {
    db: { routeList },
  } = useContext(DbContext);
  const { t } = useTranslation();
  const language = useLanguage();
  let location = useLocation();
  const navigate = useNavigate();
  const weatherCodes = useWeatherCode();
  const onlineStatus = useOnline();
  const inputRef = useRef<HTMLInputElement>(null);
  const prevPathRef = useRef<string>(location.pathname);
  const switchedTab = useRef<boolean>(false);

  const handleLanguageChange = (lang: "zh" | "en") => {
    vibrate(vibrateDuration);
    navigate(location.pathname.replace("/" + language, "/" + lang), {
      replace: true,
    });
    changeLanguage(lang);
  };

  const relocateGeolocation = useCallback(() => {
    try {
      if (window.iOSRNWebView === true) return;
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          updateGeolocation({ lat: latitude, lng: longitude });
        },
        () => {},
        { enableHighAccuracy: true }
      );
    } catch (e) {
      console.log("error in getting location");
    }
  }, [updateGeolocation]);

  const handleKeydown = useCallback(
    ({ key, ctrlKey, altKey, metaKey, target }: KeyboardEvent) => {
      if (ctrlKey || altKey || metaKey) return;
      if ((target as HTMLElement).tagName.toUpperCase() === "INPUT") return;
      if ((target as HTMLElement).tagName.toUpperCase() === "TEXTAREA") return;

      if (key === "Escape") {
        setSearchRoute("");
      } else if (key === "Backspace") {
        setSearchRoute(searchRoute.slice(0, -1));
      } else if (key.length === 1) {
        setSearchRoute(searchRoute + key);
        navigate(`/${language}/board`, { replace: true });
      }
    },
    [searchRoute, language, setSearchRoute, navigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      switchedTab.current = true;
      setIsSearching(false);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, setIsSearching]);

  const handleInputClick = () => {
    if (!inputRef.current) return;

    if (switchedTab.current) {
      switchedTab.current = false;
      inputRef.current.focus();
      setIsSearching(true);
      return;
    }
    if (isSearching) {
      inputRef.current.blur();
      setIsSearching(false);
    } else {
      inputRef.current.focus();
      setIsSearching(true);
    }
  };

  const isColorModeSystem = _colorMode === "system";
  const isColorModeLight = _colorMode === "light";
  const isColorModeDark = _colorMode === "dark";

  return (
    <header className="flex items-center justify-between border-b">
      <Link
        to={`/${language}`}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          vibrate(vibrateDuration);
          navigate(`/${language}`);
        }}
        rel="nofollow"
        aria-label="Home"
        className="text-decoration-none"
      >
        {onlineStatus === "online" && (
          <div className="bg-contain w-8 h-8 bg-[url(/img/logo128.png)] dark:bg-[url(/img/dark-32.jpg)]" />
        )}
        {onlineStatus === "offline" && (
          <Button variant="ghost" size="icon">
            <Icon icon={WifiOff} />
          </Button>
        )}
        <Typography component="h1" className="sr-only">
          {t("巴士到站預報")}
        </Typography>
      </Link>
      <div className="relative">
        <Box
          onClick={() => {
            setIsSearching(!isSearching);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex cursor-pointer items-center"
          role="button"
          aria-label="Search Route"
          tabIndex={0}
        >
          <Icon icon={Search} size={16} className="opacity-80" />
        </Box>
        <input
          id="searchInput"
          type="text"
          ref={inputRef}
          value={searchRoute}
          placeholder={t("路線")}
          onChange={(e) => {
            if (
              e.target.value.toUpperCase() in routeList ||
              e.target.value in routeList
            ) {
              (document.activeElement as HTMLElement).blur();
              navigate(`/${language}/route/${e.target.value}`);
            }
            setSearchRoute(e.target.value);
          }}
          onClick={handleInputClick}
          onFocus={() => {
            vibrate(vibrateDuration);
            if (navigator.userAgent !== "prerendering" && checkMobile()) {
              (document.activeElement as HTMLElement).blur();
            }
            navigate(`/${language}/board`, { replace: true });
          }}
          aria-label="search input, you may enter the route directly"
          className="w-[100px] border-0 border-b border-foreground bg-transparent py-1 pl-8 text-center focus-visible:ring-0 focus-visible:border-primary"
        />
      </div>
      <Box className="flex items-center">
        {weatherCodes.slice(0, 2).map((code) => (
          <button
            key={code}
            onClick={() =>
              openUrl(
                `https://www.hko.gov.hk/${
                  language === "zh" ? "tc" : "en"
                }/detail.htm`
              )
            }
            className="m-1 h-6 w-6 bg-white"
            aria-label={`Weather ${code}`}
          >
            <img
              src={WeatherIcons[code]}
              alt={`Weather ${code}`}
              className="h-6 w-6"
            />
          </button>
        ))}
      </Box>
      <Box className="flex items-center opacity-70">
        {geoPermission === "granted" && (
          <Button
            variant="ghost"
            size="sm"
            aria-label="relocate"
            onClick={() => relocateGeolocation()}
          >
            <Icon icon={MapPin} size={18} />
          </Button>
        )}
        <Button
          onClick={() => handleLanguageChange(language === "zh" ? "en" : "zh")}
          id="lang-selector"
          variant="ghost"
          className="w-10 min-w-0 rounded px-1 font-black text-foreground"
          aria-label="Language button"
        >
          {language !== "zh" ? "繁" : "En"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            vibrate(vibrateDuration);
            toggleColorMode();
          }}
          aria-label="color theme button"
        >
          {isColorModeSystem && <Icon icon={Monitor} size={18} />}
          {isColorModeLight && <Icon icon={Sun} size={18} />}
          {isColorModeDark && <Icon icon={Moon} size={18} />}
        </Button>
        <Link
          to={`/${language}/settings`}
          rel="nofollow"
          className="inline-flex"
        >
          <Button variant="ghost" size="sm" aria-label="settings button">
            <Icon icon={Settings} size={18} />
          </Button>
        </Link>
      </Box>
    </header>
  );
};

export default Header;
