import React, { useEffect, useRef, useState, useCallback } from "react";

import styles from "./TimelinePreview.module.css";

const FRAME_WIDTH = 120;
const FRAME_HEIGHT = 90;

const calculateFrameCount = (
  containerWidth: number,
  frameWidth: number
): number => {
  return Math.ceil(containerWidth / frameWidth);
};

interface TimelinePreviewProps {
  startTime: number;
  endTime: number;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const TimelinePreview = React.memo(
  ({ startTime, endTime, videoRef }: TimelinePreviewProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [frames, setFrames] = useState<string[]>([]);

    const generateFrames = useCallback(
      (videoUrl: string, frameCount: number) => {
        const video = document.createElement("video");
        video.src = videoUrl;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.currentTime = startTime;

        let frames: string[] = [];
        setFrames([]);

        video.addEventListener("loadedmetadata", () => {
          const range = endTime - startTime;
          const interval = range / frameCount;

          let currentFrame = 0;

          const renderFrame = () => {
            if (currentFrame >= frameCount) {
              setFrames(frames);
              return;
            }

            if (currentFrame > 0) {
              const captureTime = startTime + currentFrame * interval;
              video.currentTime = captureTime;
            }

            video.requestVideoFrameCallback(() => {
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              if (context) {
                canvas.width = FRAME_WIDTH;
                canvas.height = FRAME_HEIGHT;
                context.drawImage(
                  video,
                  0,
                  0,
                  video.videoWidth,
                  video.videoHeight,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
              }
              frames.push(canvas.toDataURL());
              currentFrame++;
              renderFrame();
            });
          };

          renderFrame();
        });
      },
      [startTime, endTime]
    );

    useEffect(() => {
      const container = containerRef.current;
      const video = videoRef.current;
      if (container && video && video.src) {
        const frameCount = calculateFrameCount(
          container.offsetWidth,
          FRAME_WIDTH
        );
        generateFrames(video.src, frameCount);
      }
    }, [startTime, endTime, generateFrames]);

    return (
      <div className={styles.container} ref={containerRef}>
        {frames.length > 0 ? (
          frames.map((url, index) => (
            <img className={styles.frame} key={index} src={url} alt="" />
          ))
        ) : (
          <div className={styles.loading}>Loading frames...</div>
        )}
      </div>
    );
  }
);
