import { NavLink } from 'react-router-dom';
import useTooltip from '../hooks/useTooltip';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const ButtonMenu = ({ link, label, icon, shortCut }) => {
    const { store } = useGlobalReducer()
    const { showShortcut } = store;

    const tooltipRef = useTooltip({
        title: label,
        placement: 'bottom',
        trigger: 'hover',
    });

    return (
        <div className="text-center position-relative">
            <NavLink
                to={link}
                ref={tooltipRef}
                className={({ isActive }) =>
                    `btn menu-btn ${isActive ? 'btn-primary active' : 'btn-success'} btn-circle`
                }

            >
                <i className={`fa-solid ${icon}`}></i>
            </NavLink>

            {showShortcut && (
                <span className="badge badge-shortcut bg-dark">
                    {shortCut}
                </span>
            )}
        </div>
    );
};
