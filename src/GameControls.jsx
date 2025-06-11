function GameControls({ timerMode, setTimerMode, sortMode, setSortMode, timeLimit, setTimeLimit }) {
  return (
    <div className="game-controls">
      <div>
        <label>Sort by: </label>
        <select value={sortMode} onChange={e => setSortMode(e.target.value)}>
          <option value="default">Default</option>
          <option value="origin">Origin</option>
          <option value="class">Class</option>
        </select>
      </div>
      <div>
        <label>Timer: </label>
        <select value={timerMode} onChange={e => setTimerMode(e.target.value)}>
          <option value="up">Count Up</option>
          <option value="down">Count Down</option>
        </select>
        {timerMode === "down" && (
          <input
            type="number"
            min={10}
            max={3600}
            step={10}
            value={timeLimit}
            onChange={e => setTimeLimit(Number(e.target.value))}
            style={{ width: 60, marginLeft: 8 }}
            title="Seconds"
          />
        )}
      </div>
    </div>
  );
}

export default GameControls;