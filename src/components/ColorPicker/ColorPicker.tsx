import React, { useCallback } from "react";
import {
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
} from "react-aria-components";

import type { Color } from "react-aria-components";

import styles from "./ColorPicker.module.css";

const CHECK_ICON = (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
    <path
      fill="currentcolor"
      d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
    />
  </svg>
);

interface ColorPickerProps {
  colors: string[];
  value?: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ colors, value, onChange }: ColorPickerProps) => {
  const handleChange = useCallback(
    (value: Color) => {
      onChange(value.toString("hex"));
    },
    [onChange]
  );

  return (
    <ColorSwatchPicker
      className={styles.container}
      value={value}
      onChange={handleChange}
    >
      {colors.map((color: string, index: number) => (
        <ColorSwatchPickerItem
          className={styles.item}
          color={color}
          key={index}
        >
          <ColorSwatch className={styles.swatch} />
          {color === value && <div className={styles.icon}>{CHECK_ICON}</div>}
        </ColorSwatchPickerItem>
      ))}
    </ColorSwatchPicker>
  );
};
