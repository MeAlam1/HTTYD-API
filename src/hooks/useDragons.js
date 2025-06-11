import {useMemo} from "react";

const modules = import.meta.glob('../data/*.json', {eager: true});

export default function useDragons() {
    const dragons = useMemo(() => {
        return Object.values(modules)
            .flatMap((mod) => Array.isArray(mod.default) ? mod.default : mod)
            .map((d) => ({
                name: d.name,
                image: d.img,
                class: d.class,
                film: d.origin,
            }));
    }, []);

    const classes = useMemo(() => {
        return [...new Set(dragons.map((d) => d.class))];
    }, [dragons]);

    return {dragons, classes};
}