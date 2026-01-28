import React from "react";
import { Progress } from "./ui/progress";

export { CircularProgress } from "./ui/circular-progress";

export const LinearProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <Progress ref={ref} className={className} {...props} />;
});
