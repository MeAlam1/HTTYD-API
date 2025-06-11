import TopBar from "./components/TopBar";
import DragonGrid from "./components/DragonGrid";
import GameControls from "./components/GameControls";
import Timer from "./components/Timer";
import useDragons from "./hooks/useDragons";
import useGameState from "./hooks/useGameState";
import "./style/styles.css";
import {useEffect, useState} from "react";

function App() {
    const {dragons, classes} = useDragons();
    const [filteredClass, setFilteredClass] = useState(null);

    const {
        sortMode, setSortMode,
        timerMode, setTimerMode,
        timeLimit, setTimeLimit, timerStarted,
        guess,
        revealed, setRevealed,
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

    const filteredAllRevealed = filteredClass
        ? filteredIndices.every(index => revealed[index])
        : allRevealed;

    const sortedDragonsList = filteredSortedIndices.map((i) => dragons[i]);

    useEffect(() => {
        window.completeGame = () => {
            console.log("Revealing all visible dragons...");

            if (filteredClass) {
                const newRevealed = [...revealed];
                dragons.forEach((dragon, index) => {
                    if (dragon.class === filteredClass) {
                        newRevealed[index] = true;
                    }
                });
                setRevealed(newRevealed);
            } else {
                setRevealed(Array(dragons.length).fill(true));
            }
        };

        return () => {
            delete window.completeGame;
        };
    }, [dragons, revealed, filteredClass, setRevealed]);

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

            {(filteredAllRevealed || timerRanOut) && (
                <h2 className="complete-text">
                    {filteredAllRevealed
                        ? `🎉 All done in ${Timer.formatTime(timerMode === "down" ? timeLimit * 60 - elapsed : elapsed)}!`
                        : `⏰ Time's up! You were almost there with ${filteredRevealed.filter(Boolean).length}/${filteredDragons.length} dragons!`}
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