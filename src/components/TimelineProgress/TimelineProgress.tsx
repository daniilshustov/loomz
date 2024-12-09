import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./TimelineProgress.module.css";

const calculateProgress = (mouseX: number, timelineWidth: number): number => {
  const clampedMouseX = Math.max(0, Math.min(mouseX, timelineWidth));
  return (clampedMouseX / timelineWidth) * 100;
};

const calculateTime = (
  mouseX: number,
  timelineWidth: number,
  startTime: number,
  endTime: number
): number => {
  const duration = endTime - startTime;
  const time = startTime + (mouseX / timelineWidth) * duration;
  return Math.max(startTime, Math.min(time, endTime));
};

type DragState = {
  timelineStartX: number;
  timelineWidth: number;
  wasPlaying: boolean;
};

interface TimelineProgressProps {
  startTime: number;
  endTime: number;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const TimelineProgress = ({
  startTime,
  endTime,
  videoRef,
}: TimelineProgressProps) => {
  const dragState = useRef<DragState>({
    timelineStartX: 0,
    timelineWidth: 0,
    wasPlaying: false,
  });

  const progressRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      event.preventDefault();

      if (!videoRef.current) return;

      const timelineRect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX - timelineRect.left;
      const progress = calculateProgress(mouseX, timelineRect.width);

      dragState.current = {
        timelineStartX: timelineRect.left,
        timelineWidth: timelineRect.width,
        wasPlaying: !videoRef.current.paused,
      };

      setIsDragging(true);

      videoRef.current.pause();
      videoRef.current.currentTime = calculateTime(
        mouseX,
        timelineRect.width,
        startTime,
        endTime
      );

      if (progressRef.current) {
        progressRef.current.style.transform = `translateX(${progress - 100}%)`;
      }
    },
    [startTime, endTime]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { timelineStartX, timelineWidth } = dragState.current;
      const mouseX = event.clientX - timelineStartX;
      const progress = calculateProgress(mouseX, timelineWidth);

      if (progressRef.current) {
        progressRef.current.style.transform = `translateX(${progress - 100}%)`;
      }

      if (videoRef.current) {
        videoRef.current.currentTime = calculateTime(
          mouseX,
          timelineWidth,
          startTime,
          endTime
        );
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);

      const video = videoRef.current;
      if (video && dragState.current.wasPlaying) {
        video.play();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startTime, endTime]);

  const updateProgressBar = useCallback(() => {
    const video = videoRef.current;
    if (video && progressRef.current) {
      const duration = endTime - startTime;
      const progress = Math.min(
        ((video.currentTime - startTime) / duration) * 100,
        100
      );
      progressRef.current.style.transform = `translateX(${progress - 100}%)`;

      if (!video.paused && !video.ended) {
        requestRef.current = requestAnimationFrame(updateProgressBar);
      }
    }
  }, [startTime, endTime]);

  const handlePause = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const handlePlay = useCallback(() => {
    requestRef.current = requestAnimationFrame(updateProgressBar);
  }, [updateProgressBar]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);

    return () => {
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
    };
  }, [handlePause, handlePlay]);

  return (
    <div className={styles.container} onMouseDown={handleMouseDown}>
      <div className={styles.progress} ref={progressRef}>
        <svg
          className={styles.pointer}
          aria-hidden="true"
          width={15}
          height={13}
        >
          <path
            fill="currentcolor"
            d="M12.5 0a2 2 0 0 1 2 2v3.5a2 2 0 0 1-.52 1.345l-5 5.5a2 2 0 0 1-2.96 0l-5-5.5A2 2 0 0 1 .5 5.5V2a2 2 0 0 1 2-2h10Z"
          />
        </svg>
      </div>
    </div>
  );
};
