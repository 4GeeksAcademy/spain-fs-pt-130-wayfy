import React from 'react'
import { useShortcut } from '../../hooks/useShortcut'

export const ShortcutToggle = () => {
    const { showShortcut, toggleShortcut, shortcutKey } = useShortcut()

    return (
        <div
            className="theme-switch-container position-relative"
            role="switch"
            aria-checked={showShortcut}
        >
            <button className="theme-switch" onClick={toggleShortcut}>
                <div className={`theme-switch-slider ${showShortcut ? "bg-primary active" : "bg-primary"}`}>
                    <i className={`${showShortcut ? "fa-solid fa-keyboard" : "fa-regular fa-keyboard"} text-white`}></i>
                </div>
            </button>

            {showShortcut && (
                <span className="badge badge-shortcut bg-dark">
                    {shortcutKey}
                </span>
            )}
        </div>
    )
}
