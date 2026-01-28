import React from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    );
  }
);

Box.displayName = "Box";
