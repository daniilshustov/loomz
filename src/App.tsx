import React, { useCallback, useEffect, useRef } from "react";

import { CaptionEditor } from "components/CaptionEditor";
import { Timeline } from "components/Timeline";
import { VideoPreview } from "components/VideoPreview";

import type { Caption } from "types";

import "./App.css";

const DATA: {
  videoUrl: string;
  startTime: number;
  endTime: number;
  captions: Caption[];
} = {
  videoUrl:
    "https://storage.googleapis.com/loomz-downloaded-videos/storage_folder/id_246_1732534559723low.mp4",
  startTime: 10,
  endTime: 57,
  captions: [
    {
      word: "He",
      start_time: 56.1,
      end_time: 56.6,
    },
    {
      word: "is",
      start_time: 56.6,
      end_time: 56.6,
    },
    {
      word: "so",
      start_time: 56.6,
      end_time: 56.9,
    },
  ],
};

function App() {
  const { videoUrl, startTime, endTime, captions } = DATA;

  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));

  if (!videoRef.current.src) {
    videoRef.current.src = videoUrl;
    videoRef.current.crossOrigin = "anonymous";
    videoRef.current.currentTime = startTime;
  }

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video && video.currentTime >= endTime) {
      video.pause();
      video.currentTime = startTime;
    }
  }, [startTime, endTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [handleTimeUpdate]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay]);

  return (
    <div className="App">
      <div className="CaptionEditor">
        <CaptionEditor
          startTime={startTime}
          endTime={endTime}
          captions={captions}
        />
      </div>
      <div className="VideoPreview">
        <VideoPreview aspectRatio={9 / 16} videoRef={videoRef} />
      </div>
      <div className="Timeline">
        <Timeline startTime={startTime} endTime={endTime} videoRef={videoRef} />
      </div>
    </div>
  );
}

export default App;
