import { useTheme } from "../../context/ThemeContext";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import useTooltip from "../../hooks/useTooltip";
import { HOTKEYS } from "../../hotkeys/config";

export default function ThemeSelector() {
    const { theme, changeTheme } = useTheme();
    const { store } = useGlobalReducer();
    const { showShortcut } = store;
    const { TOGGLE_CONTRAST } = HOTKEYS;
    const tooltipRef = useTooltip({
        title: 'Alto contraste',
        placement: 'bottom',
        trigger: 'hover',
    })

    const isHighContrast = theme === "high-contrast";

    const toggleTheme = () => {
        changeTheme(isHighContrast ? "light" : "high-contrast");
    };

    return (
        <div className="theme-selector d-flex align-items-center justify-content-between position-relative w-100">
            {/* <label htmlFor="themeSwitch" className="m-0">
                Alto contraste
            </label> */}

            <button
                ref={tooltipRef}
                id="themeSwitch"
                className={`switch-toggle ${isHighContrast ? "active" : ""}`}
                role="switch"
                aria-checked={isHighContrast}
                onClick={toggleTheme}
            >
                <span className="switch-slider">
                    <i className={`fa-solid ${isHighContrast ? "fa-eye-low-vision" : "fa-eye"}`}></i>
                </span>
            </button>
            {showShortcut && (
                <span className="badge bg-dark position-absolute ms-2" style={{ right: '-55px' }}>
                    {TOGGLE_CONTRAST.combo}
                </span>
            )}

        </div>
    );
}
