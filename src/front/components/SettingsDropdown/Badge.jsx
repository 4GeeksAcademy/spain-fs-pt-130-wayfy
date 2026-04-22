import React from 'react'

export const Badge = ({ label, position = 'bottom' }) => {
    let classPosition = position === 'top' || position === 'bottom' ? ' translate-middle-x mt-1' : ''

    return (
        <div className={`badge bg-black position-absolute ${classPosition}`}>
            {label}
        </div>
    )
}
