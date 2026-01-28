import { useContext } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Icon } from "../ui/Icon";
import { Star, Navigation as NearMeIcon, Bookmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RouteCollection } from "../../@types/types";
import CollectionContext from "../../CollectionContext";
import { useHorizontalWheelScroll } from "../../hooks/useHorizontalWheelScroll";

interface HomeTabbarProps {
  homeTab: HomeTabType | string;
  onChangeTab: (v: HomeTabType, rerenderList: boolean) => void;
}

const HomeTabbar = ({ homeTab, onChangeTab }: HomeTabbarProps) => {
  const { t } = useTranslation();
  const { collections } = useContext(CollectionContext);
  useHorizontalWheelScroll();

  return (
    <Tabs
      value={homeTab}
      onValueChange={(v) => onChangeTab(v as HomeTabType, true)}
    >
      <TabsList className="min-h-[36px] bg-background justify-start w-full overflow-x-auto">
        <TabsTrigger
          className="min-w-[85px] min-h-[32px] py-0 data-[state=active]:bg-muted"
          value="nearby"
        >
          <Icon icon={NearMeIcon} className="w-4 h-4" />
          <span className="ml-1 text-[0.8em]">{t("附近")}</span>
        </TabsTrigger>
        <TabsTrigger
          className="min-w-[85px] min-h-[32px] py-0 data-[state=active]:bg-muted"
          value="saved"
        >
          <Icon icon={Star} className="w-4 h-4" />
          <span className="ml-1 text-[0.8em]">{t("常用")}</span>
        </TabsTrigger>
        <TabsTrigger
          className="min-w-[85px] min-h-[32px] py-0 data-[state=active]:bg-muted"
          value="collections"
        >
          <Icon icon={Bookmark} className="w-4 h-4" />
          <span className="ml-1 text-[0.8em]">{t("Collections")}</span>
        </TabsTrigger>
        {collections.map((collection, idx) => (
          <TabsTrigger
            key={`collection-${idx}`}
            className="min-w-[85px] min-h-[32px] py-0 data-[state=active]:bg-muted"
            value={collection.name}
          >
            <span className="text-[0.8em]">{collection.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default HomeTabbar;

export type HomeTabType = "saved" | "nearby" | "collections";

export const isHomeTab = (
  input: unknown,
  collections: RouteCollection[]
): input is HomeTabType => {
  if (input === "saved" || input === "nearby" || input === "collections") {
    return true;
  }
  for (let i = 0; i < collections.length; ++i) {
    if (input === collections[i].name) {
      return true;
    }
  }
  return false;
};
