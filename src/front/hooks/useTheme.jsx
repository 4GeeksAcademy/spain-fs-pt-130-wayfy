import { useEffect, useCallback } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';

const AVAILABLE_THEMES = ['light', 'high-contrast'];
const STORAGE_KEY = 'theme';

export const useTheme = () => {
    const { store, dispatch } = useGlobalReducer();
    const theme = store.theme ?? 'light';

    useEffect(() => {
        const html = document.documentElement;
        AVAILABLE_THEMES.forEach(t => html.classList.remove(t));
        html.classList.add(theme);
    }, [theme]);

    const setTheme = useCallback((newTheme) => {
        if (!AVAILABLE_THEMES.includes(newTheme)) return;
        dispatch({ type: 'SET_THEME', payload: newTheme });
        try { localStorage.setItem(STORAGE_KEY, newTheme); } catch (e) { }
    }, [dispatch]);

    const toggleHighContrast = useCallback(() => {
        setTheme(theme === 'high-contrast' ? 'light' : 'high-contrast');
    }, [theme, setTheme]);

    return {
        theme,
        setTheme,
        toggleHighContrast,
        isHighContrast: theme === 'high-contrast',
    };
}
