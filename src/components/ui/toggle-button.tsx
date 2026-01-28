import * as React from "react";
import { cn } from "../../lib/utils";

interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  value?: string;
  selected?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      className,
      selected,
      children,
      icon,
      iconPosition = "start",
      value,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={props["aria-label"] || value}
        value={value}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "h-9 px-3",
          selected
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
          className
        )}
        {...props}
      >
        {icon && iconPosition === "start" && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "end" && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);
ToggleButton.displayName = "ToggleButton";

interface ToggleButtonGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string | string[];
  onChange?: (
    event: React.MouseEvent<HTMLElement>,
    value: string | string[] | null
  ) => void;
  exclusive?: boolean;
  children?: React.ReactNode;
  size?: "small" | "medium" | "large";
}

const ToggleButtonGroup = React.forwardRef<
  HTMLDivElement,
  ToggleButtonGroupProps
>(
  (
    {
      className,
      value,
      onChange,
      exclusive = true,
      children,
      size = "medium",
      ...props
    },
    ref
  ) => {
    const handleChange = (
      event: React.MouseEvent<HTMLElement>,
      newValue: string
    ) => {
      if (!onChange) return;

      if (exclusive) {
        onChange(event, value === newValue ? "" : newValue);
      } else {
        const currentValues = Array.isArray(value)
          ? value
          : value
            ? [value]
            : [];
        const newValues = currentValues.includes(newValue)
          ? currentValues.filter((v) => v !== newValue)
          : [...currentValues, newValue];
        onChange(event, newValues);
      }
    };

    const sizeClasses = {
      small: "h-7 px-2 text-xs",
      medium: "h-9 px-3 text-sm",
      large: "h-11 px-4 text-base",
    };

    const clonedChildren = React.Children.map(children, (child) => {
      if (
        React.isValidElement<ToggleButtonProps>(child) &&
        child.type === ToggleButton
      ) {
        const childValue = child.props.value;
        if (childValue === undefined) return child;

        const isSelected = exclusive
          ? value === childValue
          : Array.isArray(value) && value.includes(childValue);

        return React.cloneElement(child, {
          selected: isSelected,
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            handleChange(e, childValue);
            child.props.onClick?.(e);
          },
          className: cn(sizeClasses[size], child.props.className),
        });
      }
      return child;
    });

    return (
      <div
        ref={ref}
        role={exclusive ? "radiogroup" : "group"}
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
          className
        )}
        {...props}
      >
        {clonedChildren}
      </div>
    );
  }
);
ToggleButtonGroup.displayName = "ToggleButtonGroup";

export { ToggleButton, ToggleButtonGroup };
