import React from 'react'
import ThemeSelector from './ThemeSelector'
import { ShortcutToggle } from './ShortcutToggle'
import { useTheme } from '../../context/ThemeContext'
import { HOTKEYS } from '../../hotkeys/config'
import useGlobalReducer from '../../hooks/useGlobalReducer'

export const SettingsDropdown = () => {
    const { store } = useGlobalReducer()
    const { showShortcut } = store
    const { GO_CONFIG } = HOTKEYS
    const { theme } = useTheme()

    return (
        <div className="dropdown">
            <button
                id='btnSettings'
                type='button'
                className="btn btn-secondary btn-settings"
                data-bs-toggle='dropdown'
                data-bs-auto-close="outside"
                aria-expanded='false'
            >
                <i className="fa-solid fa-gear"></i>
            </button>

            {showShortcut && (
                <span className="badge badge-shortcut bg-dark">
                    {GO_CONFIG.combo}
                </span>
            )}

            <div className="dropdown-menu dropdown-menu-end p-3 settings-dropdown mt-2 shadow" style={{ width: '250px' }}>
                <ThemeSelector />
                <ShortcutToggle />
            </div>
        </div>
    )
}
