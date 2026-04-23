import { useTheme } from "../../context/ThemeContext";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { HOTKEYS } from "../../hotkeys/config";

export default function ThemeSelector() {
    const { theme, changeTheme } = useTheme();
    const { store } = useGlobalReducer();
    const { showShortcut } = store;
    const { TOGGLE_CONTRAST } = HOTKEYS;

    const isHighContrast = theme === "high-contrast";

    const toggleTheme = () => {
        changeTheme(isHighContrast ? "light" : "high-contrast");
    };

    return (
        <div className="d-flex align-items-center justify-content-between w-100">
            <label htmlFor="themeSwitch" className="m-0">
                Alto contraste
            </label>

            {showShortcut && (
                <span className="badge bg-dark ms-2">
                    {TOGGLE_CONTRAST.combo}
                </span>
            )}

            <div className="form-check form-switch m-0">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="themeSwitch"
                    checked={isHighContrast}
                    onChange={toggleTheme}
                />
            </div>

        </div>
    );
}
