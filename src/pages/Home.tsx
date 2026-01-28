import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { setSeoHeader } from "../utils";
import HomeTabbar, { isHomeTab } from "../components/home/HomeTabbar";
import type { HomeTabType } from "../components/home/HomeTabbar";
import BadWeatherCard from "../components/layout/BadWeatherCard";
import SwipeableList, {
  SwipeableListRef,
} from "../components/home/SwipeableList";
import DbRenewReminder from "../components/layout/DbRenewReminder";
import { useParams } from "react-router-dom";
import useLanguage from "../hooks/useTranslation";
import CollectionContext from "../CollectionContext";
import DbContext from "../context/DbContext";
import NoticeCard from "../components/layout/NoticeCard";

const Home = () => {
  const { AppTitle } = useContext(DbContext);
  const { collections } = useContext(CollectionContext);
  const { t } = useTranslation();
  const language = useLanguage();
  const { collectionName } = useParams();

  const swipeableList = useRef<SwipeableListRef>(null);
  const _homeTab = collectionName ?? localStorage.getItem("homeTab");
  const [homeTab, setHomeTab] = useState<HomeTabType | string>(
    isHomeTab(_homeTab, collections) ? _homeTab : "nearby"
  );

  useEffect(() => {
    setSeoHeader({
      title: `${t("Dashboard")} - ${t(AppTitle)}`,
      description: t("home-page-description"),
      lang: language,
    });
  }, [language, AppTitle, t]);

  const handleTabChange = (
    v: HomeTabType | string,
    rerenderList: boolean = false
  ) => {
    setHomeTab(v);
    localStorage.setItem("homeTab", v);
    if (swipeableList.current && rerenderList) {
      swipeableList.current.changeTab(v);
    }
  };

  return (
    <main className="dark:bg-background bg-white text-center flex flex-col overflow-auto w-full h-full">
      <h1 className="sr-only">{`${t("Dashboard")} - ${t(AppTitle)}`}</h1>
      <h2 className="sr-only">{t("home-page-description")}</h2>
      <HomeTabbar homeTab={homeTab} onChangeTab={handleTabChange} />
      <NoticeCard />
      <BadWeatherCard />
      <DbRenewReminder />
      <SwipeableList
        ref={swipeableList}
        homeTab={homeTab}
        onChangeTab={handleTabChange}
      />
    </main>
  );
};

export default Home;
