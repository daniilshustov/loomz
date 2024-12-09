import React from "react";
import {
  Input,
  Label,
  TextField as TextFieldComponent,
} from "react-aria-components";

import styles from "./TextField.module.css";

interface TextFieldProps {
  autoFocus?: boolean;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const TextField = ({ label, ...props }: TextFieldProps) => (
  <TextFieldComponent {...props} className={styles.container}>
    {label && <Label className={styles.label}>{label}</Label>}
    <Input className={styles.input} />
  </TextFieldComponent>
);
