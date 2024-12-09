import React from "react";
import { Button as ButtonComponent } from "react-aria-components";

import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onPress?: () => void;
}

export const Button = ({ children, icon, ...props }: ButtonProps) => (
  <ButtonComponent className={styles.container} {...props}>
    {icon}
    <div className={styles.content}>{children}</div>
  </ButtonComponent>
);
