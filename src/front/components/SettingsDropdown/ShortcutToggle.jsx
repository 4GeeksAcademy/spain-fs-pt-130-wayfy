import React from 'react'
import { useShortcut } from '../../hooks/useShortcut'
import { useTheme } from '../../hooks/useTheme'
import useTooltip from '../../hooks/useTooltip'

export const ShortcutToggle = () => {
    const { showShortcut, toggleShortcut, shortcutKey } = useShortcut()
    const { theme } = useTheme()
    const tooltipRef = useTooltip({
        title: 'Mostrar shortcuts',
        placement: 'bottom',
        trigger: 'hover',
    })


    return (
        <div className="shortcut-toggle d-flex align-items-center justify-content-between position-relative w-100">
            {/* <label htmlFor="shortcutSwitch" className="m-0">
                Mostrar atajos
            </label> */}

            <button
                id="shortcutSwitch"
                ref={tooltipRef}
                className={`switch-toggle ${showShortcut ? "active" : ""}`}
                role="switch"
                aria-checked={showShortcut}
                onClick={toggleShortcut}
            >
                <span className="switch-slider">
                    <i className={`${showShortcut ? 'fa-solid' : 'fa-regular'} fa-keyboard`}></i>
                </span>
            </button>

            {showShortcut && (
                <span className="badge bg-dark position-absolute ms-2" style={{ right: '-55px' }}>
                    {shortcutKey}
                </span>
            )}


        </div>
    )
}
