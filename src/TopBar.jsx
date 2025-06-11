function TopBar({ guess, onGuessChange, revealedCount, total, timer, onReset }) {
  return (
    <div className="top-bar">
      <div className="info-box">
        <label>Dragon:</label>
        <input
          placeholder="Dragon name..."
          value={guess}
          onChange={onGuessChange}
          autoFocus
        />
      </div>
      <div className="info-box">
        <label>Amount:</label>
        <div>{revealedCount} / {total}</div>
      </div>
      <div className="info-box">
        <label>Timer:</label>
        <div>{timer}</div>
      </div>
      <button className="reset-btn" onClick={onReset}>Reset</button>
    </div>
  );
}

export default TopBar;