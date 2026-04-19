import { useTheme } from "../context/ThemeContext";
import useTooltip from "../hooks/useTooltip";

export default function ThemeSelector() {
    const { theme, changeTheme } = useTheme();

    const isHighContrast = theme === "high-contrast";

    const toggleTheme = () => {
        changeTheme(isHighContrast ? "light" : "high-contrast");
    };

    return (
        <div className="theme-switch-container" role="switch" aria-checked={isHighContrast}>
            <button className="theme-switch" onClick={toggleTheme}>
                <div className={`theme-switch-slider ${isHighContrast ? "bg-primary active" : "bg-primary"}`}>
                    <i className={`fa-solid ${isHighContrast ? "fa-eye-low-vision" : "fa-eye text-white"}`}></i>
                </div>
            </button>
        </div>
    );
}
