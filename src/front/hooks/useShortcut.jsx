import useGlobalReducer from "../hooks/useGlobalReducer";
import { HOTKEYS } from "../hotkeys/config";

export const useShortcut = () => {
    const { store, dispatch } = useGlobalReducer();
    const { showShortcut } = store;
    const { TOGGLE_SHORTCUTS } = HOTKEYS;

    const toggleShortcut = () => {
        dispatch({ type: "TOGGLE_SHORTCUTS" });
    };

    return {
        showShortcut,
        toggleShortcut,
        shortcutKey: TOGGLE_SHORTCUTS.combo
    };
};
