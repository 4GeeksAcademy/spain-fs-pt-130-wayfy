import { Link } from 'react-router-dom';
import useTooltip from '../hooks/useTooltip';

export const ButtonMenu = ({ link, label, icon, clase }) => {
    const tooltipRef = useTooltip({
        title: label,
        placement: 'bottom',
        trigger: 'hover',
    });
    return (
        <div className="text-center">
            <Link
                to={link}
                className={`btn ${clase}`}
                ref={tooltipRef}
                data-bs-togge="tooltip"
            >
                <i className={`fa-solid ${icon}`}></i>
            </Link>
        </div>
    );
};
