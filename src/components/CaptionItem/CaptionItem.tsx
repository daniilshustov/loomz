import React, { useCallback } from "react";
import { Dialog, Popover } from "react-aria-components";

import { Button } from "components/Button";
import { ColorPicker } from "components/ColorPicker";
import { Stack } from "components/Stack";
import { TextField } from "components/TextField";

import type { Caption } from "types";

import styles from "./CaptionItem.module.css";

const COLORS = ["#4CB051", "#F50156", "#FF9800"];

const REMOVE_ICON = (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
    <path
      fill="currentcolor"
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
    />
  </svg>
);

interface CaptionItemProps {
  caption: Caption;
  index: number;
  onChange: (index: number, update: Partial<Caption>) => void;
  onRemove: (index: number) => void;
}

export const CaptionItem = ({
  caption,
  index,
  onChange,
  onRemove,
}: CaptionItemProps) => {
  const triggerRef = React.useRef<HTMLSpanElement>(null);

  const [isOpen, setOpen] = React.useState(false);

  const handleChange = useCallback(
    (value: string) => {
      onChange(index, {
        word: value,
      });
    },
    [index, onChange]
  );

  const handleColorChange = useCallback(
    (value: string) => {
      onChange(index, {
        color: value,
      });
    },
    [index, onChange]
  );

  const handleRemove = useCallback(() => {
    setOpen(false);
    onRemove(index);
  }, [index, onRemove]);

  return (
    <>
      <span
        className={styles.word}
        ref={triggerRef}
        role="button"
        style={{ color: caption.color }}
        onClick={() => setOpen(true)}
      >
        {Boolean(caption.word) ? caption.word : "..."}
      </span>
      {caption.end_time > caption.start_time && (
        <span className={styles.time}>
          {" "}
          {Number(caption.end_time - caption.start_time).toFixed(1) + "s"}
        </span>
      )}
      <Popover
        isOpen={isOpen}
        placement="bottom start"
        triggerRef={triggerRef}
        onOpenChange={setOpen}
      >
        <Dialog className={styles.dialog}>
          <Stack>
            <TextField autoFocus value={caption.word} onChange={handleChange} />
            <ColorPicker
              colors={COLORS}
              value={caption.color}
              onChange={handleColorChange}
            />
            <Button icon={REMOVE_ICON} onPress={handleRemove}>
              Remove caption
            </Button>
          </Stack>
        </Dialog>
      </Popover>
    </>
  );
};
