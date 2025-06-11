import {useEffect, useRef, useState} from "react";

export default function useGameState(dragons) {
    const [sortMode, setSortMode] = useState("class");
    const [timerMode, setTimerMode] = useState("up");
    const [timeLimit, setTimeLimit] = useState(120);

    const [guess, setGuess] = useState("");
    const [revealed, setRevealed] = useState(Array(dragons.length).fill(false));
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const timerStarted = useRef(false);

    const [sortedIndices, setSortedIndices] = useState(dragons.map((_, i) => i));
    useEffect(() => {
        let indices = dragons.map((_, i) => i);
        if (sortMode === "film") {
            indices = [...indices].sort(
                (a, b) => (dragons[a].film || "").localeCompare(dragons[b].film || "")
            );
        } else if (sortMode === "class") {
            indices = [...indices].sort(
                (a, b) => (dragons[a].class || "").localeCompare(dragons[b].class || "")
            );
        }
        setSortedIndices(indices);
    }, [sortMode, dragons]);

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

    const handleQuit = () => {
        setStartTime(null);
        setElapsed(timerMode === "down" ? timeLimit : 0);
        timerStarted.current = false;
    };

    const allRevealed = revealed.every(Boolean);
    const timerRanOut = timerMode === "down" && elapsed === 0 && timerStarted.current && !allRevealed;

    return {
        sortMode, setSortMode,
        timerMode, setTimerMode,
        timeLimit, setTimeLimit,
        guess, setGuess,
        revealed, setRevealed,
        startTime, setStartTime,
        elapsed, setElapsed,
        timerStarted, handleGuessChange, handleReset, handleQuit,
        allRevealed, timerRanOut, sortedIndices
    };
}