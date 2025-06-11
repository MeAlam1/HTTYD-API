import TopBar from "./components/TopBar";
import DragonGrid from "./components/DragonGrid";
import GameControls from "./components/GameControls";
import Timer from "./components/Timer";
import useDragons from "./hooks/useDragons";
import useGameState from "./hooks/useGameState";
import "./style/styles.css";

function App() {
    const dragons = useDragons();
    const {
        sortMode, setSortMode,
        timerMode, setTimerMode,
        timeLimit, setTimeLimit, timerStarted,
        guess,
        revealed,
        elapsed, setElapsed, setStartTime, handleGuessChange, handleReset, handleQuit,
        allRevealed, timerRanOut, sortedIndices
    } = useGameState(dragons);

    const sortedRevealed = sortedIndices.map(i => revealed[i]);
    const sortedDragonsList = sortedIndices.map(i => dragons[i]);

    return (
        <div className="app">
            <TopBar
                guess={guess}
                onGuessChange={handleGuessChange}
                revealedCount={revealed.filter(Boolean).length}
                total={dragons.length}
                timer={<Timer elapsed={elapsed}/>}
                onReset={handleReset}
                onQuit={handleQuit}
            />

            <DragonGrid dragons={sortedDragonsList} revealed={sortedRevealed} sortMode={sortMode}/>

            {(allRevealed || timerRanOut) && (
                <h2 className="complete-text">
                    {allRevealed
                        ? `🎉 All done in ${Timer.formatTime(timerMode === "down" ? timeLimit - elapsed : elapsed)}!`
                        : "⏰ Time's up!"}
                </h2>
            )}

            <div style={{marginTop: "2rem", width: "100%"}}>
                <hr/>
                <h3 style={{marginBottom: 8}}>Game Types / Categories</h3>
                <GameControls
                    timerMode={timerMode}
                    setTimerMode={mode => {
                        setTimerMode(mode);
                        handleReset();
                    }}
                    timeLimit={timeLimit}
                    setTimeLimit={val => {
                        setTimeLimit(val);
                        if (timerMode === "down") setElapsed(val);
                    }}
                    setStartTime={setStartTime}
                    sortMode={sortMode}
                    setSortMode={mode => {
                        setSortMode(mode);
                        handleReset();
                    }}
                    setElapsed={setElapsed}
                    timerStarted={timerStarted}
                    handleReset={handleReset}
                    elapsed={elapsed}
                />
            </div>
        </div>
    );
}

export default App;