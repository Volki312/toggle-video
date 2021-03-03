import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./index.css";

interface Player {
  isBuffering: boolean;
  ref: React.RefObject<ReactPlayer> | null;
  source: string;
}

const initialPlayersState: [Player, Player] = [
  {
    isBuffering: false,
    ref: null,
    source: "http://media.w3.org/2010/05/bunny/movie.mp4",
  },
  {
    isBuffering: false,
    ref: null,
    source: "http://media.w3.org/2010/05/sintel/trailer.mp4",
  },
];

const App: React.FC = () => {
  const [players, setPlayers] = useState<[Player, Player]>([
    { ...initialPlayersState[0], ref: useRef(null) },
    { ...initialPlayersState[1], ref: useRef(null) },
  ]);
  const [activeVideoIndex, setActiveVideoIndex] = useState<0 | 1>(0);
  const [areVideosPlaying, setAreVideosPlaying] = useState<boolean>(false);
  const activePlayer = useMemo(() => players[activeVideoIndex].ref?.current, [
    activeVideoIndex,
    players,
  ]);
  const inactivePlayer = useMemo(
    () => players[activeVideoIndex ? 0 : 1].ref?.current,
    [activeVideoIndex, players]
  );

  const toggleActiveVideo = () => {
    setActiveVideoIndex((prevIndex) => (prevIndex ? 0 : 1));
  };
  const togglePlayerBuffering = () => (index: number) => {
    setPlayers((prevPlayers) => {
      prevPlayers[index].isBuffering = !prevPlayers[index].isBuffering;
      return prevPlayers;
    });
  };
  const playVideos = () => setAreVideosPlaying(true);
  const pauseVideos = () => setAreVideosPlaying(false);

  useEffect(() => {
    if (activePlayer && inactivePlayer) {
      const progressInterval = (activePlayer.getCurrentTime() || 0) + 0.1;
      inactivePlayer.seekTo(progressInterval, "seconds");
    }
  }, [activePlayer, inactivePlayer]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "r" && !event.repeat) toggleActiveVideo();
    };

    window.addEventListener("keyup", handleKeyPress);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div id="player">
      <div className="video-wrapper" onClick={toggleActiveVideo}>
        {players.map((player, index) => (
          <ReactPlayer
            key={index}
            ref={player.ref}
            url={player.source}
            className="video"
            style={{ display: activeVideoIndex === index ? "block" : "none" }}
            width="100%"
            height="100%"
            playing={areVideosPlaying}
            controls={false}
            pip={false}
            muted={activeVideoIndex !== index}
            onBuffer={togglePlayerBuffering}
            onBufferEnd={togglePlayerBuffering}
          />
        ))}
      </div>
      <div className="controls">
        {players[0].isBuffering || players[1].isBuffering ? (
          <button className="control" onClick={() => {}}>
            <div className="spinner"></div>
          </button>
        ) : (
          <button className="control" onClick={playVideos}>
            &#9658;
          </button>
        )}
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
