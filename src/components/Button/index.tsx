import clsx from "clsx";

import classes from "./styles.module.scss";
import { ButtonProps } from "./types";

export const Button = (props: ButtonProps) => {
  const { text, icon, variant, className } = props;

  return (
    <button
      className={clsx(classes.button, classes[`button_${variant}`], className)}
    >
      {text}
      {icon && icon}
    </button>
  );
};
