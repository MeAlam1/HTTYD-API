function groupBy(arr, key) {
    return arr.reduce((acc, item, idx) => {
        const group = item[key] || "Unknown";
        if (!acc[group]) acc[group] = [];
        acc[group].push({...item, revealed: idx});
        return acc;
    }, {});
}

function DragonGrid({dragons, revealed, sortMode}) {
    let groupKey = null;
    if (sortMode === "class") groupKey = "class";
    else if (sortMode === "film") groupKey = "film";

    if (!groupKey) {
        return (
            <div className="grid">
                {dragons.map((d, i) => (
                    <div key={i} className="grid-item">
                        {revealed[i] && <img src={d.image} alt={d.name}/>}
                    </div>
                ))}
            </div>
        );
    }

    const grouped = groupBy(dragons, groupKey);
    const sortedGroups = Object.entries(grouped).sort((a, b) => a[1].length - b[1].length);

    return (
        <div className="dragon-groups-container">
            {sortedGroups.map(([group, groupDragons]) => (
                <div key={group} className="dragon-group">
                    <h4 className="dragon-group-title">{group}</h4>
                    <div className={`grid grid-category ${sortMode}-grid`}>
                        {groupDragons.map((d) => (
                            <div key={d.name} className="grid-item">
                                {revealed[d.revealed] && <img src={d.image} alt={d.name}/>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DragonGrid;