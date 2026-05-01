import { forwardRef } from "react";
import clsx from "clsx";
import type { ButtonProps } from "./button.types";

const variantStyles = {
  primary:
    "bg-red-600 text-black hover:bg-red-500",

  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200",

  ghost:
    "bg-transparent hover:bg-red-50",

  outline:
    "border border-gray-300 hover:border-red-500",

  danger:
    "bg-red-600 text-white hover:bg-red-700",
  
  
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(function Button(
  {
    children,

    variant = "primary",
    size = "md",

    loading = false,
    disabled,

    leftIcon,
    rightIcon,

    width,
    height,

    className,

    style,

    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  const customStyle = {
    width:
      typeof width === "number"
       ? `${width}px`
       : width,

    height:
      typeof height === "number"
      ? `${height}px`
      : height,

      ...style
  };

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      style={customStyle}
      className={clsx(
       "inline-flex items-center justify-center gap-2",

        "font-medium",

        "transition-colors duration-200",


        "disabled:opacity-50 disabled:cursor-not-allowed",


        variantStyles[variant],

        sizeStyles[size],

        className
      )}
      {...props}
    >
      {loading && (
        <span className="animate-spin">
          ⏳
        </span>
      )}

      {!loading && leftIcon}

      <span>{children}</span>

      {!loading && rightIcon}
    </button>
  );
});