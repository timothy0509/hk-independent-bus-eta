import { useState } from "react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { useCallback, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "../../context/AppContext";

const FontSizeSlider = () => {
  const { fontSize: _fontSize, setFontSize: setAppFontSize } =
    useContext(AppContext);
  const { t } = useTranslation();
  const [fontSize, setFontSize] = useState<number>(_fontSize);
  const value = useRef<number>(fontSize);

  useEffect(() => {
    return () => {
      setAppFontSize(value.current);
    };
  }, [setAppFontSize]);

  const handleChange = useCallback(([v]: number[]) => {
    setFontSize(v);
    value.current = v;
  }, []);

  return (
    <div className="space-y-2 px-4">
      <div className="flex items-center justify-between">
        <Label style={{ fontSize }}>{t("字體大小")}</Label>
      </div>
      <Slider
        step={2}
        min={10}
        max={26}
        value={[fontSize]}
        onValueChange={handleChange}
      />
    </div>
  );
};

export default FontSizeSlider;
