import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

  
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;

  loading?: boolean;

  leftIcon?: ReactNode;
  rightIcon?: ReactNode;

  /**自定义宽高 */
  width?: number | string;
  height?: number | string
}