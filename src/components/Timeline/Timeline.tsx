import React from "react";

import { TimelinePreview } from "components/TimelinePreview";
import { TimelineProgress } from "components/TimelineProgress";

import styles from "./Timeline.module.css";

interface TimelineProps {
  startTime: number;
  endTime: number;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const Timeline = ({ startTime, endTime, videoRef }: TimelineProps) => (
  <div className={styles.container}>
    <div className={styles.preview}>
      <TimelinePreview
        startTime={startTime}
        endTime={endTime}
        videoRef={videoRef}
      />
    </div>
    <div className={styles.progress}>
      <TimelineProgress
        startTime={startTime}
        endTime={endTime}
        videoRef={videoRef}
      />
    </div>
  </div>
);
