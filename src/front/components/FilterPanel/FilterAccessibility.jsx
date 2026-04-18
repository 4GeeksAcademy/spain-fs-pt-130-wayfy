import React from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

const ACCESSIBILITY_FILTERS = [
    {
        value: 'yes',
        label: 'Total',
        color: 'success',
        faIcon: 'fa-solid fa-wheelchair',
    },
    {
        value: 'limited',
        label: 'Parcial',
        color: 'warning',
        faIcon: 'fa-solid fa-triangle-exclamation',
    },
    { value: 'no', label: 'No', color: 'danger', faIcon: 'fa-solid fa-ban' },
    {
        value: 'unknown',
        label: '?',
        color: 'secondary',
        faIcon: 'fa-solid fa-circle-question',
    },
];

export const FilterAccessibility = () => {
    const { store, dispatch } = useGlobalReducer();
    const { activeFilters = [] } = store;

    const toggle = (value) => {
        const newValues = activeFilters.includes(value)
            ? activeFilters.length > 1
                ? activeFilters.filter((v) => v !== value)
                : activeFilters
            : [...activeFilters, value];

        dispatch({ type: 'SET_ACTIVE_FILTERS', payload: newValues });
    };

    return (
        <section>
            <h6 className="text-primary">Accesibilidad</h6>

            <div className="d-flex gap-1">
                {ACCESSIBILITY_FILTERS.map((f) => {
                    const isActive = activeFilters.includes(f.value);
                    return (
                        <button
                            key={f.value}
                            onClick={() => toggle(f.value)}
                            className={`btn btn-sm flex-fill d-flex flex-column align-items-center py-2 border-2 rounded-2 
                                ${isActive
                                    ? `btn-${f.color} fw-bold shadow-sm`
                                    : 'btn-light border-light-subtle text-muted fw-bold opacity-50'
                                }`}
                        >
                            <i className={`${f.faIcon} mb-1`}></i>
                            <span className="text-small">{f.label}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
