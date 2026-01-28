import React from "react";
import type { LucideIcon } from "lucide-react";
import type { SVGAttributes } from "react";
import { cn } from "../../lib/utils";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  icon: LucideIcon;
  size?: number | string;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, size = 24, className, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        size={typeof size === "number" ? size : undefined}
        className={cn("shrink-0", className)}
        style={{
          width: typeof size === "string" ? size : undefined,
          height: typeof size === "string" ? size : undefined,
          ...props.style,
        }}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";
