import { Link } from "../components/ui/link";
import { Fragment, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useLanguage from "../hooks/useTranslation";

interface NoticeType {
  ChinShort: string;
  ChinText: string;
  CountofDistricts: string;
  CurrentStatus: string;
  EngShort: string;
  EngText: string;
  IncidentRefNo: string;
  ListOfDistrict: string;
  ReferenceDate: string;
  msgID: string;
}

const Notice = () => {
  const language = useLanguage();
  const [notices, setNotices] = useState<NoticeType[]>([]);

  useEffect(() => {
    fetch("https://resource.data.one.gov.hk/td/en/specialtrafficnews.xml")
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => setNotices(xmlToJson(data)));
  }, []);

  return (
    <div className="flex flex-col overflow-auto w-full flex-1 text-left p-1 gap-2 bg-background">
      {notices.map(({ msgID, ChinText, EngText, ReferenceDate }, i) => (
        <Fragment key={msgID}>
          {(i === 0 || ReferenceDate !== notices[i - 1].ReferenceDate) && (
            <p className="text-xs self-end">{ReferenceDate}</p>
          )}
          <div className="p-2 flex flex-col gap-2 break-words shadow-md">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ ...props }) => <p className="text-sm" {...props} />,
                a: ({ ...props }) => (
                  <Link target="_blank" {...props} className="text-primary" />
                ),
              }}
            >
              {language === "zh" ? ChinText : EngText}
            </ReactMarkdown>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Notice;

const xmlToJson = (root: Document): NoticeType[] => {
  return Array.from(root.querySelectorAll("message"))
    .map((msg) => Array.from(msg.querySelectorAll("*")))
    .map((nodes) =>
      nodes.reduce((acc, node) => {
        if (node.textContent === null) return acc;
        if (node.tagName === "ReferenceDate") {
          acc[node.tagName] = node.textContent
            .replace("下午", "PM")
            .replace("上午", "AM");
        } else {
          acc[node.tagName as keyof NoticeType] = node.textContent
            .replace(/\n/g, "\n\n")
            .replace(
              /詳情請參看: 特別交通消息網頁。/g,
              "詳情請參看: [特別交通消息網頁](https://www.td.gov.hk/tc/special_news/spnews.htm)。"
            )
            .replace(
              /For more details, please visit: Special Traffic News Page./g,
              "For more details, please visit: [Special Traffic News Page](https://www.td.gov.hk/en/special_news/spnews.htm)."
            );
        }
        return acc;
      }, {} as NoticeType)
    );
};
