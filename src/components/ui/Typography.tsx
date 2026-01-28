import React from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "caption"
  | "subtitle1";

interface TypographyProps
  extends HTMLAttributes<
    HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement
  > {
  variant?: TypographyVariant;
  children?: ReactNode;
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

const variantClasses: Record<TypographyVariant, string> = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-semibold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-semibold",
  h6: "text-base font-semibold",
  body1: "text-base",
  body2: "text-sm",
  caption: "text-xs text-muted-foreground",
  subtitle1: "text-base font-medium",
};

const defaultComponents: Record<
  TypographyVariant,
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  caption: "span",
  subtitle1: "p",
};

export const Typography = React.forwardRef<
  HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement,
  TypographyProps
>(({ variant = "body1", component, className, children, ...props }, ref) => {
  const Component = component || defaultComponents[variant];
  const variantClassName = variantClasses[variant];

  return (
    <Component
      ref={ref as any}
      className={cn(variantClassName, className)}
      {...props}
    >
      {children}
    </Component>
  );
});

Typography.displayName = "Typography";
