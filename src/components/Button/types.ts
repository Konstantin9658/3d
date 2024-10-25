import { ReactNode } from "react";

export interface ButtonProps {
  text: string;
  icon?: ReactNode;
  variant: "primary" | "secondary" | "third";
  className?: string;
}
