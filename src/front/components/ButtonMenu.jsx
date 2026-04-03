import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

export const ButtonMenu = ({ link, label, icon, clase }) => {
    const buttonRef = useRef(null)

    useEffect(() => {
        const bootstrapTooltip = new window.bootstrap.Tooltip(buttonRef.current, {
            title: label,
            placement: 'bottom',
            trigger: 'hover'
        })

        return () => bootstrapTooltip.dispose()
    }, [label])
    return (
        <div className="text-center">
            <Link to={link} className={`btn ${clase}`} ref={buttonRef} data-bs-togge='tooltip'>
                <i className={`fa-solid ${icon}`}></i>
            </Link>
        </div>
    )
}
