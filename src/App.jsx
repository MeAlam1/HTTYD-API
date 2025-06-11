import TopBar from "./components/TopBar";
import DragonGrid from "./components/DragonGrid";
import GameControls from "./components/GameControls";
import Timer from "./components/Timer";
import useDragons from "./hooks/useDragons";
import useGameState from "./hooks/useGameState";
import "./style/styles.css";
import {useState} from "react";

function App() {
    const {dragons, classes} = useDragons();
    const [filteredClass, setFilteredClass] = useState(null);

    const {
        sortMode, setSortMode,
        timerMode, setTimerMode,
        timeLimit, setTimeLimit, timerStarted,
        guess,
        revealed,
        elapsed, setElapsed, setStartTime, handleGuessChange, handleReset, handleQuit,
        allRevealed, timerRanOut, sortedIndices
    } = useGameState(dragons, filteredClass);

    const filteredDragons = filteredClass
        ? dragons.filter((d) => d.class === filteredClass)
        : dragons;


    const filteredIndices = dragons
        .map((d, i) => (filteredDragons.includes(d) ? i : -1))
        .filter((i) => i !== -1);

    const filteredSortedIndices = sortedIndices.filter((i) => filteredIndices.includes(i));
    const filteredRevealed = filteredSortedIndices.map((i) => revealed[i]);

    const sortedDragonsList = filteredSortedIndices.map((i) => dragons[i]);

    return (
        <div className="app">
            <TopBar
                guess={guess}
                onGuessChange={handleGuessChange}
                revealedCount={filteredRevealed.filter(Boolean).length}
                total={filteredDragons.length}
                timer={<Timer elapsed={elapsed}/>}
                onReset={handleReset}
                onQuit={handleQuit}
            />

            <DragonGrid dragons={sortedDragonsList} revealed={filteredRevealed} sortMode={sortMode}/>

            {(allRevealed || timerRanOut) && (
                <h2 className="complete-text">
                    {allRevealed
                        ? `🎉 All done in ${Timer.formatTime(timerMode === "down" ? timeLimit - elapsed : elapsed)}!`
                        : "⏰ Time's up!"}
                </h2>
            )}

            <div style={{marginTop: "2rem", width: "100%"}}>
                <hr/>
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
                    setFilteredClass={setFilteredClass}
                    filteredClass={filteredClass}
                    classes={classes}
                />
            </div>
        </div>
    );
}

export default App;