import * as React from "react";
import { cn } from "../../lib/utils";

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "secondary" | "inherit";
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    { className, size = 40, strokeWidth = 3.6, color = "primary", ...props },
    ref
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const center = size / 2;

    const colorClasses = {
      primary: "text-primary",
      secondary: "text-secondary",
      inherit: "text-current",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          className
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          className="animate-spin"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            className="text-muted opacity-25"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
          />
          <circle
            className={colorClasses[color]}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={center}
            cy={center}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: circumference * 0.75,
            }}
          />
        </svg>
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
