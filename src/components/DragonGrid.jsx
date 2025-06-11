function DragonGrid({dragons, revealed, sortMode}) {
    const dragonsWithIndex = dragons.map((d, idx) => ({...d, originalIndex: idx}));

    const groupBy = (arr, key) =>
        arr.reduce((acc, item) => {
            const group = item[key] || "Unknown";
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
        }, {});

    let groupKey = null;
    if (sortMode === "class") groupKey = "class";
    else if (sortMode === "film") groupKey = "film";

    if (!groupKey) {
        return (
            <div className="grid">
                {dragonsWithIndex.map((d) => (
                    <div key={`${d.name}-${d.originalIndex}`} className="grid-item">
                        {revealed[d.originalIndex] && <img src={d.image} alt={d.name}/>}
                    </div>
                ))}
            </div>
        );
    }

    const grouped = groupBy(dragonsWithIndex, groupKey);
    const sortedGroups = Object.entries(grouped).sort((a, b) => a[1].length - b[1].length);

    return (
        <div className="dragon-groups-container">
            {sortedGroups.map(([group, groupDragons]) => (
                <div key={group} className="dragon-group">
                    <h4 className="dragon-group-title">{group}</h4>
                    <div className={`grid grid-category ${sortMode}-grid`}>
                        {groupDragons.map((d) => (
                            <div key={`${d.name}-${d.originalIndex}`} className="grid-item">
                                {revealed[d.originalIndex] && <img src={d.image} alt={d.name}/>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}


export default DragonGrid;