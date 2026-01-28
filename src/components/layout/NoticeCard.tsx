import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import useLanguage from "../../hooks/useTranslation";
import { useCallback, useContext, useEffect, useState } from "react";
import { iOSRNWebView } from "../../utils";
import { Language } from "../../data";
import AppContext from "../../context/AppContext";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertTriangle, X } from "lucide-react";

interface NoticeCardState {
  content: Record<Language, string[]>;
  url: string;
  link: Record<Language, string>;
  enableLinkInIos: boolean;
  endDate: Date;
  isShown: boolean;
}

const NoticeCard = () => {
  const language = useLanguage();
  const [state, setState] = useState<NoticeCardState | null>(null);
  const [closeNoticeContent, setCloseNoticeContent] = useState<string>(
    localStorage.getItem("closeNoticeContent") ?? ""
  );
  const { openUrl } = useContext(AppContext);

  useEffect(() => {
    fetch("/notice.json")
      .then((r) => r.json())
      .then((r) =>
        setState({
          ...r,
          endDate: new Date(r.endDate),
        })
      );
  }, []);

  const handleClick = useCallback(() => {
    if (state === null) return;
    if (iOSRNWebView() && !state.enableLinkInIos) {
      return;
    }
    openUrl(state.link[language]);
  }, [language, openUrl, state]);

  const closeNotice = useCallback(() => {
    if (state) {
      localStorage.setItem("closeNoticeContent", JSON.stringify(state.content));
      setCloseNoticeContent(JSON.stringify(state.content));
    }
  }, [state]);

  if (
    state === null ||
    closeNoticeContent === JSON.stringify(state.content) ||
    !state.isShown ||
    state.endDate < new Date()
  ) {
    return null;
  }

  return (
    <Alert
      className="rounded-lg border px-2 py-1 flex items-center gap-2 text-left cursor-pointer"
      onClick={handleClick}
    >
      <Icon
        icon={AlertTriangle}
        className="text-amber-500 dark:text-amber-400"
      />
      <AlertDescription className="flex-1">
        {state.content[language].map((v, idx) => (
          <p key={`_notice-${idx}`} className="text-sm leading-relaxed">
            {v}
          </p>
        ))}
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="h-auto w-auto"
        onClick={(e) => {
          e.stopPropagation();
          closeNotice();
        }}
      >
        <Icon icon={X} />
      </Button>
    </Alert>
  );
};

export default NoticeCard;
