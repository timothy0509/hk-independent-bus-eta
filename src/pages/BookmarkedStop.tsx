import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AppContext from "../context/AppContext";
import BadWeatherCard from "../components/layout/BadWeatherCard";
import DbRenewReminder from "../components/layout/DbRenewReminder";
import StopTabbar from "../components/bookmarked-stop/StopTabbar";
import SwipeableStopList, {
  SwipeableStopListRef,
} from "../components/bookmarked-stop/SwipeableStopList";
import useLanguage from "../hooks/useTranslation";
import CollectionContext from "../CollectionContext";
import DbContext from "../context/DbContext";
import NoticeCard from "../components/layout/NoticeCard";

const BookmarkedStop = () => {
  const { colorMode } = useContext(AppContext);
  const { savedStops } = useContext(CollectionContext);
  const {
    db: { stopList },
  } = useContext(DbContext);
  const language = useLanguage();
  const swipeableList = useRef<SwipeableStopListRef>(null);
  const defaultTab = useMemo(() => {
    try {
      const cached = localStorage.getItem("stopTab") ?? "|";
      if (
        cached &&
        savedStops.includes(cached) &&
        stopList[cached.split("|")[1]]
      ) {
        return cached;
      }
      for (let i = 0; i < savedStops.length; ++i) {
        let stopId = savedStops[i].split("|")[1];
        if (stopList[stopId]) {
          return savedStops[i];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return "";
  }, [savedStops, stopList]);
  const [stopTab, setStopTab] = useState<string>(defaultTab);

  const bgColor = useMemo(() => {
    if (stopTab === "") return "unset";
    return colorMode === "dark" ? "bg-background" : "bg-white";
  }, [colorMode, stopTab]);

  const backgroundImage = useMemo(() => {
    if (stopTab === "") {
      return `url(/img/stop-bookmark-guide-${colorMode}-${language}.png)`;
    }
    return "unset";
  }, [stopTab, colorMode, language]);

  const opacity = stopTab === "" ? "opacity-80" : "";

  useEffect(() => {
    localStorage.setItem("stopTab", stopTab);
  }, [stopTab]);

  const handleTabChange = useCallback((v: string) => {
    setStopTab(v);
    swipeableList.current?.changeTab(v);
  }, []);

  return (
    <div
      className={`text-center flex flex-col overflow-auto w-full flex-1 bg-contain bg-center bg-no-repeat ${bgColor} ${opacity}`}
      style={{
        backgroundImage:
          backgroundImage !== "unset" ? backgroundImage : undefined,
      }}
    >
      <StopTabbar stopTab={stopTab} onChangeTab={handleTabChange} />
      <NoticeCard />
      <BadWeatherCard />
      <DbRenewReminder />
      <div className="flex-1 overflow-scroll">
        <SwipeableStopList
          ref={swipeableList}
          stopTab={stopTab}
          onChangeTab={handleTabChange}
        />
      </div>
    </div>
  );
};

export default BookmarkedStop;
