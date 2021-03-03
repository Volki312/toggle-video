import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import useIsMounted from "./hooks/useIsMounted";
import "./index.css";

const sources: [string, string] = [
  "https://youtu.be/J91ti_MpdHA",
  "https://youtu.be/L_LUpnjgPso",
];

const App: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [areVideosPlaying, setAreVideosPlaying] = useState<boolean>(false);
  const isMounted = useIsMounted();

  const toggleActiveVideo = () =>
    setActiveVideoIndex((prevIndex) => (prevIndex === 1 ? 0 : 1));

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
    <main>
      {/* TODO: Disable pause on video click and other controls */}
      {sources.map((source, index) => (
        <ReactPlayer
          url={source}
          key={index}
          className="video"
          playing={areVideosPlaying}
          style={{ display: activeVideoIndex === index ? "block" : "none" }}
          controls={false}
          muted={activeVideoIndex !== index}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                disablekb: 1,
              },
            },
          }}
        />
      ))}
      <div className="controls">
        <button className="control" onClick={() => setAreVideosPlaying(true)}>
          &#9658;
        </button>
        <button className="control" onClick={() => setAreVideosPlaying(false)}>
          &#10074;&#10074;
        </button>
        <button className="control" onClick={() => toggleActiveVideo()}>
          &#8633;
        </button>
      </div>
    </main>
  );
};

export default App;
