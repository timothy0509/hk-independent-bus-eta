import { useContext, useEffect } from "react";
import AppContext from "../context/AppContext";

interface RedirectPageProps {
  url: string;
}

const RedirectPage = ({ url }: RedirectPageProps) => {
  const { openUrl } = useContext(AppContext);
  useEffect(() => {
    openUrl(url);
  }, [openUrl, url]);

  return <p className="text-base">Redirecting...</p>;
};

export default RedirectPage;
