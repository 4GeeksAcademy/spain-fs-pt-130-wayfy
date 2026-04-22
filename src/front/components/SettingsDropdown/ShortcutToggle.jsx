import React from 'react'
import { useShortcut } from '../../hooks/useShortcut'

export const ShortcutToggle = () => {
    const { showShortcut, toggleShortcut, shortcutKey } = useShortcut()

    return (
        <div className="d-flex align-items-center justify-content-between w-100">
            <label htmlFor="shortcutSwitch" className="m-0">
                Mostrar atajos
            </label>

            {showShortcut && (
                <span className="badge bg-dark ms-2">
                    {shortcutKey}
                </span>
            )}

            <div className="form-check form-switch m-0">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="shortcutSwitch"
                    checked={showShortcut}
                    onChange={toggleShortcut}
                />
            </div>

        </div>
    )
}
