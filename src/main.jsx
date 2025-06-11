import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import DragonGrid from "./DragonGrid";
import GameControls from "./GameControls";
import "./styles.css";
import TopBar from "./TopBar";

const modules = import.meta.glob('./data/*.json', { eager: true });

const dragons = Object.values(modules).map((d) => ({
  name: d.name,
  image: d.img,
  class: d.class,
  origin: d.origin,
}));

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

function App() {
  const [sortMode, setSortMode] = useState("default");
  const [timerMode, setTimerMode] = useState("up");
  const [timeLimit, setTimeLimit] = useState(120);

  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(Array(dragons.length).fill(false));
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerStarted = useRef(false);

  let sortedDragons = dragons;
  if (sortMode === "origin") {
    sortedDragons = [...dragons].sort(
      (a, b) => (a.origin || "").localeCompare(b.origin || "")
    );
  } else if (sortMode === "class") {
    sortedDragons = [...dragons].sort(
      (a, b) => (a.class || "").localeCompare(b.class || "")
    );
  }

  const [sortedIndices, setSortedIndices] = useState(dragons.map((_, i) => i));
  useEffect(() => {
    let indices = dragons.map((_, i) => i);
    if (sortMode === "origin") {
      indices = [...indices].sort(
        (a, b) => (dragons[a].origin || "").localeCompare(dragons[b].origin || "")
      );
    } else if (sortMode === "class") {
      indices = [...indices].sort(
        (a, b) => (dragons[a].class || "").localeCompare(dragons[b].class || "")
      );
    }
    setSortedIndices(indices);
  }, [sortMode]);

  useEffect(() => {
    if (startTime === null) {
      setElapsed(timerMode === "down" ? timeLimit : 0);
      return;
    }
    const interval = setInterval(() => {
      const now = Date.now();
      if (timerMode === "up") {
        setElapsed(Math.floor((now - startTime) / 1000));
      } else {
        const left = timeLimit - Math.floor((now - startTime) / 1000);
        setElapsed(left > 0 ? left : 0);
        if (left <= 0) {
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, timerMode, timeLimit]);

  const handleGuessChange = (e) => {
    const value = e.target.value;
    setGuess(value);

    if (!timerStarted.current && value.trim() !== "") {
      setStartTime(Date.now());
      setElapsed(timerMode === "down" ? timeLimit : 0);
      timerStarted.current = true;
    }

    const idx = dragons.findIndex(
      (d, i) => !revealed[i] && d.name.toLowerCase() === value.trim().toLowerCase()
    );
    if (idx !== -1) {
      const newRevealed = [...revealed];
      newRevealed[idx] = true;
      setRevealed(newRevealed);
      setGuess("");
    }
  };

  const handleReset = () => {
    setRevealed(Array(dragons.length).fill(false));
    setStartTime(null);
    setElapsed(timerMode === "down" ? timeLimit : 0);
    setGuess("");
    timerStarted.current = false;
  };

  const allRevealed = revealed.every(Boolean);
  const timerRanOut = timerMode === "down" && elapsed === 0 && timerStarted.current && !allRevealed;

  const sortedRevealed = sortedIndices.map(i => revealed[i]);
  const sortedDragonsList = sortedIndices.map(i => dragons[i]);

  return (
    <div className="app">
      <TopBar
        guess={guess}
        onGuessChange={handleGuessChange}
        revealedCount={revealed.filter(Boolean).length}
        total={dragons.length}
        timer={formatTime(elapsed)}
        onReset={handleReset}
      />

      <DragonGrid dragons={sortedDragonsList} revealed={sortedRevealed} sortMode={sortMode} />

      {(allRevealed || timerRanOut) && (
        <h2 className="complete-text">
          {allRevealed
            ? `🎉 All done in ${formatTime(timerMode === "down" ? timeLimit - elapsed : elapsed)}!`
            : "⏰ Time's up!"}
        </h2>
      )}

      <div style={{ marginTop: "2rem", width: "100%" }}>
        <hr />
        <h3 style={{ marginBottom: 8 }}>Game Types / Categories</h3>
        <GameControls
          timerMode={timerMode}
          setTimerMode={mode => {
            setTimerMode(mode);
            handleReset();
          }}
          sortMode={sortMode}
          setSortMode={mode => {
            setSortMode(mode);
            handleReset();
          }}
          timeLimit={timeLimit}
          setTimeLimit={val => {
            setTimeLimit(val);
            if (timerMode === "down") setElapsed(val);
          }}
        />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);