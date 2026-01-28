import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import AppContext from "./context/AppContext";
import { SearchContextProvider } from "./SearchContext";
import Root from "./components/layout/Root";
import RedirectPage from "./pages/RedirectPage";
import reportWebVitals, { sendToGoogleAnalytics } from "./reportWebVitals";
import useLanguage from "./hooks/useTranslation";
import { ThemeProvider } from "./components/providers/ThemeProvider";

const Home = React.lazy(() => import("./pages/Home"));
const RouteEta = React.lazy(() => import("./pages/RouteEta"));
const BookmarkedStop = React.lazy(() => import("./pages/BookmarkedStop"));
const RouteBoard = React.lazy(() => import("./pages/RouteBoard"));
const RouteSearch = React.lazy(() => import("./pages/RouteSearch"));
const Notice = React.lazy(() => import("./pages/Notice"));
const Settings = React.lazy(() => import("./pages/Settings"));
const EmotionPage = React.lazy(() => import("./pages/EmotionPage"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = React.lazy(
  () => import("./pages/TermsAndConditions")
);
const Support = React.lazy(() => import("./pages/Support"));
const DataImport = React.lazy(() => import("./pages/DataImport"));
const DataExport = React.lazy(() => import("./pages/DataExport"));

const App = () => {
  const { analytics } = useContext(AppContext);
  const language = useLanguage();

  useEffect(() => {
    if (analytics) reportWebVitals(sendToGoogleAnalytics);
  }, [analytics]);

  return (
    <ThemeProvider>
      <SearchContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to={`/${language}`} />} />
            <Route path="/:lang" element={<Root />}>
              <Route path={`collections/:collectionName`} element={<Home />} />
              <Route path={`route/:id/:panel?`} element={<RouteEta />} />
              <Route path={`settings`} element={<Settings />} />
              <Route path={"notice"} element={<Notice />} />
              <Route path={`import/:data?`} element={<DataImport />} />
              <Route path={`export`} element={<DataExport />} />
              <Route path={`board`} element={<RouteBoard />} />
              <Route path={`stops`} element={<BookmarkedStop />} />
              <Route path={`search`} element={<RouteSearch />} />
              <Route path="emotion/:tab?" element={<EmotionPage />} />
              <Route path={`privacy`} element={<PrivacyPolicy />} />
              <Route path={`terms`} element={<TermsAndConditions />} />
              <Route path={`support`} element={<Support />} />
              <Route
                path={"patreon"}
                element={<RedirectPage url="https://www.patreon.com/hkbus" />}
              />
              <Route path={``} element={<Home />} />
            </Route>
            <Route
              path="/android"
              element={
                <RedirectPage url="https://play.google.com/store/apps/details?id=app.hkbus" />
              }
            />
            <Route
              path="/ios"
              element={
                <RedirectPage url="https://apps.apple.com/hk/app/hk-bus-app-%E5%B7%B4%E5%A3%AB%E5%88%B0%E7%AB%99%E9%A0%90%E5%A0%B1/id1612184906" />
              }
            />
            <Route
              path="/wear"
              element={
                <RedirectPage url="https://play.google.com/store/apps/details?id=com.loohp.hkbuseta" />
              }
            />
            <Route
              path="/watch"
              element={
                <RedirectPage url="https://apps.apple.com/us/app/hk-bus-eta-watchos/id6475241017" />
              }
            />
            <Route
              path="/telegram"
              element={<RedirectPage url="https://t.me/+T245uB32DeNlNjJl" />}
            />
            <Route
              path="/instagram"
              element={<RedirectPage url="https://instagram.com/hkbus.app" />}
            />
            <Route
              path="/source-code"
              element={
                <RedirectPage url="https://github.com/hkbus/hk-independent-bus-eta/" />
              }
            />
            <Route
              path="/faq"
              element={
                <RedirectPage url="https://github.com/hkbus/hk-independent-bus-eta/wiki/%E5%B8%B8%E8%A6%8B%E5%95%8F%E9%A1%8C-FAQ" />
              }
            />
          </Routes>
        </Router>
      </SearchContextProvider>
    </ThemeProvider>
  );
};

export default App;
