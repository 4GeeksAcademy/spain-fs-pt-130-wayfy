import { useTheme } from "../context/ThemeContext";
import useGlobalReducer from "../hooks/useGlobalReducer";
import useTooltip from "../hooks/useTooltip";
import { HOTKEYS } from "../hotkeys/config";

export default function ThemeSelector() {
    const { theme, changeTheme } = useTheme();
    const { store } = useGlobalReducer()
    const { showShortcut } = store
    const { TOGGLE_CONTRAST } = HOTKEYS

    const isHighContrast = theme === "high-contrast";

    const toggleTheme = () => {
        changeTheme(isHighContrast ? "light" : "high-contrast");
    };

    return (
        <div className="theme-switch-container position-relative" role="switch" aria-checked={isHighContrast}>
            <button className="theme-switch" onClick={toggleTheme}>
                <div className={`theme-switch-slider ${isHighContrast ? "bg-primary active" : "bg-primary"}`}>
                    <i className={`fa-solid ${isHighContrast ? "fa-eye-low-vision" : "fa-eye text-white"}`}></i>
                </div>
            </button>
            {showShortcut && (
                <span className="badge badge-shortcut bg-dark">
                    {TOGGLE_CONTRAST.combo}
                </span>
            )}
        </div>
    );
}
