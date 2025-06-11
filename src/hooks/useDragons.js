import {useEffect, useMemo, useState} from "react";

export default function useDragons(sortMode) {
    const [dragons, setDragons] = useState([]);

    useEffect(() => {
        async function fetchDragons() {
            const apiFiles = [
                '/api/boulder.json',
                '/api/mystery.json',
                '/api/sharp.json',
                '/api/stoker.json',
                '/api/strike.json',
                '/api/tidal.json',
                '/api/tracker.json',
                '/api/unknown.json',
            ];

            const allDragons = await Promise.all(
                apiFiles.map(async (file) => {
                    const response = await fetch(file);
                    return await response.json();
                })
            );

            const flattenedDragons = allDragons.flat().map((d) => ({
                name: d.name,
                image: d.img,
                class: d.class,
                film: d.origin,
            }));

            setDragons(flattenedDragons);
        }

        fetchDragons();
    }, []);

    const sortedDragons = useMemo(() => {
        if (sortMode === "film") {
            return dragons.reduce((acc, dragon) => {
                const existing = acc.find((d) => d.name === dragon.name);
                if (!existing) {
                    acc.push(dragon);
                }
                return acc;
            }, []);
        }

        return dragons;
    }, [dragons, sortMode]);

    const classes = useMemo(() => {
        return [...new Set(dragons.map((d) => d.class))];
    }, [dragons]);

    return {dragons: sortedDragons, classes};
}