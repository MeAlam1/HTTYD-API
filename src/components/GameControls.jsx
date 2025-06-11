function GameControls({timerMode, setTimerMode, sortMode, setSortMode, timeLimit, setTimeLimit}) {
    return (
        <div className="game-controls">
            <div>
                <label>Sort by: </label>
                {["film", "class"].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setSortMode(mode)}
                        className={`control-button ${sortMode === mode ? "active" : ""}`}
                    >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                ))}
            </div>
            <div>
                <label>Timer: </label>
                {["up", "down"].map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setTimerMode(mode)}
                        className={`control-button ${timerMode === mode ? "active" : ""}`}
                    >
                        {mode === "up" ? "Count Up" : "Count Down"}
                    </button>
                ))}
                {timerMode === "down" && (
                    <input
                        type="number"
                        min={10}
                        max={3600}
                        step={10}
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        style={{width: 60, marginLeft: 8}}
                        title="Seconds"
                    />
                )}
            </div>
        </div>
    );
}

export default GameControls;