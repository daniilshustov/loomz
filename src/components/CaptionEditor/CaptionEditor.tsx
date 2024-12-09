import React, { useCallback, useEffect, useState } from "react";

import { CaptionItem } from "components/CaptionItem";
import { Stack } from "components/Stack";

import type { Caption } from "types";

import styles from "./CaptionEditor.module.css";

interface CaptionEditorProps {
  startTime: number;
  endTime: number;
  captions: Caption[];
}

export const CaptionEditor = React.memo(
  ({ startTime, endTime, captions }: CaptionEditorProps) => {
    const [filteredCaptions, setFilteredCaptions] = useState<Caption[]>([]);

    useEffect(() => {
      const filtered = captions.filter(
        (caption: Caption) =>
          caption.start_time >= startTime && caption.end_time <= endTime
      );
      setFilteredCaptions(filtered);
    }, [startTime, endTime, captions]);

    const handleChange = useCallback(
      (index: number, update: Partial<Caption>) => {
        setFilteredCaptions((items: Caption[]) => {
          const item = {
            ...items[index],
            ...update,
          };
          return [...items.slice(0, index), item, ...items.slice(index + 1)];
        });
      },
      []
    );

    const handleRemove = useCallback((index: number) => {
      setFilteredCaptions((items: Caption[]) => {
        return [...items.slice(0, index), ...items.slice(index + 1)];
      });
    }, []);

    return (
      <div className={styles.container}>
        <Stack>
          <h3>Captions</h3>
          {filteredCaptions.length > 0 && (
            <>
              {filteredCaptions.map((caption: Caption, index: number) => (
                <React.Fragment key={index}>
                  <CaptionItem
                    caption={caption}
                    index={index}
                    onChange={handleChange}
                    onRemove={handleRemove}
                  />
                  {index < filteredCaptions.length - 1 && " "}
                </React.Fragment>
              ))}
            </>
          )}
        </Stack>
      </div>
    );
  }
);
