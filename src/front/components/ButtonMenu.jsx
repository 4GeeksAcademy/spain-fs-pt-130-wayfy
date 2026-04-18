import { NavLink } from 'react-router-dom';
import useTooltip from '../hooks/useTooltip';

export const ButtonMenu = ({ link, label, icon }) => {
    const tooltipRef = useTooltip({
        title: label,
        placement: 'bottom',
        trigger: 'hover',
    });

    return (
        <div className="text-center">
            <NavLink
                to={link}
                ref={tooltipRef}
                className={({ isActive }) =>
                    `btn ${isActive ? 'btn-primary' : 'btn-success'} rounded-circle`
                }
            >
                <i className={`fa-solid ${icon}`}></i>
            </NavLink>
        </div>
    );
};
