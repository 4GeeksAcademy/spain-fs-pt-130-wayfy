import { createContext, useContext, useState } from "react";

const ShortcutsContext = createContext();

export function ShortcutsProvider({ children }) {
    const [open, setOpen] = useState(false);

    const openPanel = () => setOpen(true);
    const closePanel = () => setOpen(false);

    return (
        <ShortcutsContext.Provider value={{ open, openPanel, closePanel }}>
            {children}
        </ShortcutsContext.Provider>
    );
}

export const useShortcuts = () => useContext(ShortcutsContext);
