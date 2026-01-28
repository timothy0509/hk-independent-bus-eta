import * as React from "react";
import { cn } from "../../lib/utils";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp = asChild ? "span" : "a";
    return (
      <Comp className={cn("text-primary", className)} ref={ref} {...props} />
    );
  }
);
Link.displayName = "Link";

export { Link };
