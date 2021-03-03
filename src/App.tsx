import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import useIsMounted from "./hooks/useIsMounted";
import "./index.css";

const sources: [string, string] = [
  "http://media.w3.org/2010/05/sintel/trailer.mp4",
  "http://media.w3.org/2010/05/bunny/movie.mp4",
];

const App: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<0 | 1>(0);
  const [areVideosPlaying, setAreVideosPlaying] = useState<boolean>(false);
  const isMounted = useIsMounted();

  const toggleActiveVideo = () => {
    setActiveVideoIndex((prevIndex) => (prevIndex === 1 ? 0 : 1));
  };

  const playVideos = () => setAreVideosPlaying(true);
  const pauseVideos = () => setAreVideosPlaying(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "r" && !event.repeat) toggleActiveVideo();
    };

    window.addEventListener("keyup", handleKeyPress);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      if (isMounted()) {
        window.removeEventListener("keyup", handleKeyPress);
        window.removeEventListener("keydown", handleKeyPress);
      }
    };
  }, [isMounted]);

  return (
    <div id="player">
      <div className="video-wrapper" onClick={toggleActiveVideo}>
        {sources.map((source, index) => (
          <ReactPlayer
            key={index}
            url={source}
            className="video"
            style={{ display: activeVideoIndex === index ? "block" : "none" }}
            width="100%"
            height="100%"
            playing={areVideosPlaying}
            controls={false}
            pip={false}
            muted={activeVideoIndex !== index}
            onBuffer={pauseVideos}
            onBufferEnd={playVideos}
            // onPlay={playVideos}
            // onPause={pauseVideos}
          />
        ))}
      </div>
      <div className="controls">
        <button className="control" onClick={playVideos}>
          &#9658;
        </button>
        <button className="control" onClick={pauseVideos}>
          &#10074;&#10074;
        </button>
        <button className="control" onClick={toggleActiveVideo}>
          &#8633;
        </button>
      </div>
    </div>
  );
};

export default App;
