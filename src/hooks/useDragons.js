import {useMemo} from "react";

const modules = import.meta.glob('../data/*.json', {eager: true});

export default function useDragons() {
    return useMemo(() => {
        return Object.values(modules)
            .flatMap((mod) => Array.isArray(mod.default) ? mod.default : mod)
            .map((d) => ({
                name: d.name,
                image: d.img,
                class: d.class,
                film: d.origin,
            }));
    }, []);
}