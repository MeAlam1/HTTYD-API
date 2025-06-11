import {useMemo} from "react";

const modules = import.meta.glob('../data/*.json', {eager: true});

export default function useDragons(sortMode) {
    const dragons = useMemo(() => {
        const allDragons = Object.values(modules)
            .flatMap((mod) => Array.isArray(mod.default) ? mod.default : mod)
            .map((d) => ({
                name: d.name,
                image: d.img,
                class: d.class,
                film: d.origin,
            }));

        if (sortMode === "film") {
            return allDragons.reduce((acc, dragon) => {
                const existing = acc.find((d) => d.name === dragon.name);
                if (!existing) {
                    acc.push(dragon);
                }
                return acc;
            }, []);
        }

        return allDragons;
    }, [sortMode]);

    const classes = useMemo(() => {
        return [...new Set(dragons.map((d) => d.class))];
    }, [dragons]);

    return {dragons, classes};
}