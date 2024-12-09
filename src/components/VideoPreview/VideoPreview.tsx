import React, { useEffect, useRef } from "react";

import styles from "./VideoPreview.module.css";

const renderFrame = (
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  aspectRatio: number
): void => {
  const context = canvas.getContext("2d");
  if (!context) return;

  const { videoWidth, videoHeight } = video;

  let sx = 0;
  let sy = 0;
  let sWidth = videoWidth;
  let sHeight = videoHeight;

  if (videoWidth / videoHeight > aspectRatio) {
    sWidth = videoHeight * aspectRatio;
    sx = (videoWidth - sWidth) / 2;
  } else {
    sHeight = videoWidth / aspectRatio;
    sy = (videoHeight - sHeight) / 2;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    video,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
};

interface VideoPreviewProps {
  aspectRatio: number;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoPreview = React.memo(
  ({ aspectRatio, videoRef }: VideoPreviewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      let frameRequestId: number;

      const handleFrameUpdate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        renderFrame(canvas, video, aspectRatio);
        frameRequestId = requestAnimationFrame(handleFrameUpdate);
      };

      handleFrameUpdate();

      return () => {
        if (frameRequestId) {
          cancelAnimationFrame(frameRequestId);
        }
      };
    }, [aspectRatio]);

    return (
      <div className={styles.container}>
        <canvas ref={canvasRef} width={360} height={360 / aspectRatio} />
      </div>
    );
  }
);
