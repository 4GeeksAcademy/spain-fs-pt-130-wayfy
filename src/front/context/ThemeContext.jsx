import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const AVAILABLE_THEMES = ["light", "high-contrast"];

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        return AVAILABLE_THEMES.includes(saved) ? saved : "light";
    });

    /* Aplicar clase al <html> cuando cambia el tema */
    useEffect(() => {
        const html = document.documentElement;

        // Eliminar todas las clases de tema
        AVAILABLE_THEMES.forEach(t => html.classList.remove(t));

        // Añadir la clase del tema actual
        html.classList.add(theme);

        // Guardar en localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    /* Cambiar tema manualmente */
    const changeTheme = (newTheme) => {
        if (AVAILABLE_THEMES.includes(newTheme)) {
            setTheme(newTheme);
        }
    };

    /* Alternar entre light y high-contrast (opcional) */
    const toggleHighContrast = () => {
        setTheme(prev => (prev === "high-contrast" ? "light" : "high-contrast"));
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                changeTheme,
                toggleHighContrast
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
