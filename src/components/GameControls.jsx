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
                          elapsed,
                          setFilteredClass,
                          filteredClass,
                          classes
                      }) {
    const [isPaused, setIsPaused] = useState(false);
    const [isClassPopupOpen, setIsClassPopupOpen] = useState(false);

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

    const handleClassSelect = (selectedClass) => {
        setFilteredClass(selectedClass);
        setIsClassPopupOpen(false);
    };

    return (
        <>
            <div className="game-controls">
                <div className="timer-area">
                    <label>Sort:</label>
                    <button
                        onClick={() => {
                            setSortMode("class");
                            handleReset();
                        }}
                        className={`control-button ${sortMode === "class" ? "active" : ""}`}
                    >
                        Class
                    </button>
                    <button
                        onClick={() => {
                            setSortMode("film");
                            handleReset();
                        }}
                        className={`control-button ${sortMode === "film" ? "active" : ""}`}
                    >
                        Film
                    </button>
                </div>
                <div className="timer-area">
                    <label>Timer:</label>
                    <div className="timer-buttons">
                        <button
                            onClick={handleInfinite}
                            className={`control-button ${timerMode === "up" ? "active" : ""}`}
                        >
                            ∞
                        </button>
                        <div className="time-input">
                            <input
                                type="text"
                                value={timeLimit}
                                onInput={(e) => {
                                    const numericValue = e.currentTarget.value.replace(/[^0-9]/g, "");
                                    setTimeLimit(Number(numericValue || 0));
                                }}
                                title="Minutes"
                            />
                            <span>Min</span>
                        </div>
                        <button
                            onClick={handleSetTime}
                            className={`control-button ${timerMode === "down" ? "countdown-button" : ""}`}
                        >
                            Set
                        </button>
                    </div>
                    <button onClick={handlePause} className="control-button pause-button">
                        II
                    </button>
                </div>
                <div className="timer-area">
                    <label>Mode:</label>
                    <button
                        onClick={() => {
                            setFilteredClass(null);
                            handleReset();
                        }}
                        className={`control-button ${filteredClass === null ? "active" : ""}`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setIsClassPopupOpen(true)}
                        className={`control-button ${filteredClass !== null ? "active" : ""}`}
                    >
                        Class
                    </button>
                </div>
            </div>
            {isPaused && <PauseMenu onResume={handleResume}/>}
            {isClassPopupOpen && (
                <div className="pause-menu">
                    <div className="pause-menu-content">
                        {classes.map((className) => (
                            <button
                                key={className}
                                onClick={() => handleClassSelect(className)}
                                className="pause-menu-button"
                            >
                                {className}
                            </button>
                        ))}
                        <button
                            onClick={() => setIsClassPopupOpen(false)}
                            className="pause-menu-button cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default GameControls;