function PauseMenu({onResume}) {
    return (
        <div className="pause-menu">
            <button onClick={onResume} className="pause-menu-button">
                Resume
            </button>
        </div>
    );
}

export default PauseMenu;