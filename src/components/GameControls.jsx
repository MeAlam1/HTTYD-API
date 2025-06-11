import {useState} from "react";
import PauseMenu from "./PauseMenu.jsx";

function GameControls({
                          timerMode,
                          setTimerMode,
                          timeLimit,
                          setTimeLimit,
                          setStartTime,
                          setElapsed,
                          timerStarted,
                          sortMode,
                          setSortMode,
                          handleReset,
                          elapsed
                      }) {
    const [isPaused, setIsPaused] = useState(false);

    const handleSetTime = () => {
        if (timeLimit > 0) {
            handleReset();
            setTimerMode("down");
            const timeInSeconds = timeLimit * 60;
            setElapsed(timeInSeconds);
        }
    };

    const handleInfinite = () => {
        handleReset();
        setTimerMode("up");
        setElapsed(0);
    };

    const handlePause = () => {
        setStartTime(null);
        timerStarted.current = false;
        setIsPaused(true);
    };

    const handleResume = () => {
        const now = Date.now();
        if (timerMode === "down") {
            setStartTime(now - (timeLimit * 60 - elapsed) * 1000);
        } else {
            setStartTime(now - elapsed * 1000);
        }
        timerStarted.current = true;
        setIsPaused(false);
    };

    return (
        <>
            <div className="game-controls">
                <div>
                    <label>Sort By: </label>
                    <select
                        value={sortMode}
                        onChange={(e) => {
                            setSortMode(e.target.value);
                            handleReset();
                        }}
                    >
                        <option value="class">Class</option>
                        <option value="film">Film</option>
                    </select>
                </div>
                <div>
                    <label>Timer: </label>
                    <button
                        onClick={handleInfinite}
                        className={`control-button ${timerMode === "up" ? "active" : ""}`}
                    >
                        ∞
                    </button>
                    <div style={{display: "inline-flex", alignItems: "center"}}>
                        <input
                            type="number"
                            min={1}
                            max={60}
                            step={1}
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                            style={{width: 60, marginLeft: 8}}
                            title="Minutes"
                        />
                        <span style={{marginLeft: 4}}>Min</span>
                    </div>
                    <button
                        onClick={handleSetTime}
                        className={`control-button ${timerMode === "down" ? "countdown-button" : ""}`}
                    >
                        Set
                    </button>
                    <button onClick={handlePause} className="control-button">
                        ||
                    </button>
                </div>
            </div>
            {isPaused && <PauseMenu onResume={handleResume}/>}
        </>
    );
}

export default GameControls;