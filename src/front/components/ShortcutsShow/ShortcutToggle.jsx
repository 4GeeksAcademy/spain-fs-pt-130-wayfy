import React from 'react'
import useGlobalReducer from '../../hooks/useGlobalReducer'
import { HOTKEYS } from '../../hotkeys/config'

export const ShortcutToggle = () => {
    const { store, dispatch } = useGlobalReducer()
    const { showShortcut } = store
    const { TOGGLE_SHORTCUTS } = HOTKEYS

    const toggle = () => {
        dispatch({ type: 'TOGGLE_SHORTCUTS' })
    }

    return (
        <div
            className="theme-switch-container position-relative"
            role="switch"
            aria-checked={showShortcut}
        >
            <button className="theme-switch" onClick={toggle}>
                <div className={`theme-switch-slider ${showShortcut ? "bg-primary active" : "bg-primary"}`}>
                    <i className={`${showShortcut ? "fa-solid fa-keyboard" : "fa-regular fa-keyboard"} text-white`}></i>
                </div>
            </button>

            {showShortcut && (
                <span className="badge badge-shortcut bg-dark">
                    {TOGGLE_SHORTCUTS.combo}
                </span>
            )}
        </div>
    )
}
