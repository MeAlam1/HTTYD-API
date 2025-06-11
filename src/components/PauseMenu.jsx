function PauseMenu({onResume}) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <button
                onClick={onResume}
                style={{
                    padding: "1rem 2rem",
                    fontSize: "1.5rem",
                    backgroundColor: "#0f0",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                Resume
            </button>
        </div>
    );
}

export default PauseMenu;