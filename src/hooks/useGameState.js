import {useEffect, useRef, useState} from "react";

export default function useGameState(dragons, filteredClass) {
    const [sortMode, setSortMode] = useState("class");
    const [timerMode, setTimerMode] = useState("up");
    const [timeLimit, setTimeLimit] = useState(20);

    const [guess, setGuess] = useState("");
    const [revealed, setRevealed] = useState(Array(dragons.length).fill(false));
    const [startTime, setStartTime] = useState(null);
    const [elapsed, setElapsed] = useState(0);
    const timerStarted = useRef(false);

    const [sortedIndices, setSortedIndices] = useState(dragons.map((_, i) => i));
    const allRevealed = revealed.every(Boolean);

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
        const filteredIndices = dragons
            .map((d, i) => (filteredClass ? (d.class === filteredClass ? i : -1) : i))
            .filter(i => i !== -1);

        const isGameComplete = filteredClass
            ? filteredIndices.every(index => revealed[index])
            : allRevealed;

        if (isGameComplete && timerStarted.current) {
            setStartTime(null);
            timerStarted.current = false;
        }
    }, [revealed, dragons, filteredClass, allRevealed]);

    useEffect(() => {
        if (startTime === null) {
            if (!timerStarted.current) return;
            setElapsed(timerMode === "down" ? timeLimit * 60 : 0);
            return;
        }
        const interval = setInterval(() => {
            const now = Date.now();
            if (timerMode === "up") {
                setElapsed(Math.floor((now - startTime) / 1000));
            } else {
                const left = timeLimit * 60 - Math.floor((now - startTime) / 1000);
                setElapsed(left > 0 ? left : 0);
                if (left <= 0) {
                    clearInterval(interval);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime, timerMode, timeLimit]);

    const handleReset = () => {
        setRevealed(Array(dragons.length).fill(false));
        setStartTime(null);
        setElapsed(timerMode === "down" ? timeLimit * 60 : 0);
        setGuess("");
        timerStarted.current = false;
    };

    const handleQuit = () => {
        setStartTime(null);
        setGuess("");
        timerStarted.current = false;
    };

const handleGuessChange = (e) => {
    const value = e.target.value;
    setGuess(value);

    if (!timerStarted.current && value.trim() !== "") {
        setStartTime(Date.now());
        setElapsed(timerMode === "down" ? timeLimit * 60 : 0);
        setRevealed(Array(dragons.length).fill(false));
        timerStarted.current = true;
    }

    const matchingIndices = dragons
        .map((dragon, index) => ({ dragon, index }))
        .filter(({ dragon, index }) => {
            const isValidClass = !filteredClass || dragon.class === filteredClass;
            return !revealed[index] && isValidClass &&
                dragon.name.toLowerCase() === value.trim().toLowerCase();
        })
        .map(({ index }) => index);

    if (matchingIndices.length > 0) {
        const newRevealed = [...revealed];
        matchingIndices.forEach((idx) => {
            newRevealed[idx] = true; // Reveal all matching dragons
        });
        setRevealed(newRevealed);
        setGuess("");
    }
};

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