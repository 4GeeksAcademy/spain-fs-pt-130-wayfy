import './css/AccessibilityMap.css'

const LEGEND_ITEMS = [
    { label: 'Totalmente accesible', colorClass: 'bg-success' },
    { label: 'Acceso parcial / rampa', colorClass: 'bg-warning' },
    { label: 'No accesible / Escalones', colorClass: 'bg-danger' },
    { label: 'Sin datos registrados', colorClass: 'bg-secondary' },
];

export const Legend = () => {
    return (
        <div
            className="legend position-absolute bg-white opacity-75 rounded-3 p-1 shadow border z-1"
        >
            <div className="d-flex flex-column gap-2 mt-2">
                {LEGEND_ITEMS.map((item, index) => (
                    <div className="d-flex align-items-center" key={index}>
                        <div
                            className={`legend-icon ${item.colorClass} rounded-circle d-flex align-items-center justify-content-center shadow-sm`}

                        >
                            <span className="text-white">{item.icon}</span>
                        </div>
                        <span
                            className="ms-2 text-dark"
                            style={{ fontSize: '0.8rem', fontWeight: '500' }}
                        >
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
