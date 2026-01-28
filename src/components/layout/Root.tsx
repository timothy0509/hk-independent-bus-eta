import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import GACookieConsent from "./GACookieConsent";
import CollectionDrawer from "./CollectionDrawer";
import CollectionDialog from "./collections/CollectionDialog";
import { Suspense } from "react";
import PinDialog from "./PinDialog";
import { Box } from "../ui/box";

const Root = () => {
  return (
    <div className="flex h-full max-w-screen-sm flex-col justify-between mx-auto">
      <Header />
      <Suspense fallback={null}>
        <Box className="flex flex-1 flex-col overflow-hidden bg-background">
          <GACookieConsent />
          <Outlet />
        </Box>
      </Suspense>
      <Footer />
      <CollectionDrawer />
      <CollectionDialog />
      <PinDialog />
    </div>
  );
};

export default Root;
