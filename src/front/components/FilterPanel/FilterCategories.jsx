import React from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

const PLACE_CATEGORIES = [
    { value: 'alojamiento', label: 'Alojamientos', faIcon: 'fa-bed' },
    { value: 'gastronomia', label: 'Gastronomía', faIcon: 'fa-utensils' },
    { value: 'transporte', label: 'Transporte', faIcon: 'fa-bus' },
    { value: 'salud', label: 'Salud', faIcon: 'fa-house-medical' },
    { value: 'cultura_turismo', label: 'Turismo', faIcon: 'fa-landmark-flag' },
    { value: 'recreacion', label: 'Ocio', faIcon: 'fa-champagne-glasses' },
    { value: 'deporte', label: 'Deporte', faIcon: 'fa-volleyball' },
    { value: 'gobierno', label: 'Oficinas', faIcon: 'fa-building-columns' },
    { value: 'baños', label: 'Baños', faIcon: 'fa-restroom' },
    { value: 'dinero', label: 'Bancos', faIcon: 'fa-money-bill-transfer' },
    { value: 'tiendas', label: 'Tiendas', faIcon: 'fa-bag-shopping' },
    { value: 'otros', label: 'Otros', faIcon: 'fa-ellipsis' },
];

export const FilterCategories = ({ typeView = 'grid' }) => {
    const { store, dispatch } = useGlobalReducer();
    const { activeCategories = [] } = store;

    const toggle = (value) => {
        const newValues = activeCategories.includes(value)
            ? activeCategories.length > 1
                ? activeCategories.filter((v) => v !== value)
                : activeCategories
            : [...activeCategories, value];

        dispatch({ type: 'SET_ACTIVE_CATEGORIES', payload: newValues });
    };

    const handleSelectAll = () => {
        const isAll = activeCategories.length !== PLACE_CATEGORIES.length;
        dispatch({
            type: 'SET_ACTIVE_CATEGORIES',
            payload: isAll
                ? PLACE_CATEGORIES.map((i) => i.value)
                : [PLACE_CATEGORIES[0].value],
        });
    };

    return (
        <section>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-primary m-0">Categorías</h6>
                <button
                    onClick={handleSelectAll}
                    className="btn btn-sm btn-light text-small fw-bold"
                >
                    {activeCategories.length === PLACE_CATEGORIES.length
                        ? 'Seleccionar uno'
                        : 'Seleccionar todos'}
                </button>
            </div>

            <div className="row g-1">
                {PLACE_CATEGORIES.map((cat) => {
                    const isActive = activeCategories.includes(cat.value);
                    return (
                        <div
                            key={cat.value}
                            className={`${typeView === 'grid' ? 'col-4' : 'col-12'}`}
                        >
                            <button
                                onClick={() => toggle(cat.value)}
                                className={`btn btn-sm w-100 d-flex flex-column align-items-center py-2 border-2 rounded-2 ${
                                    isActive
                                        ? 'btn-success border-success text-primary fw-bold shadow-sm'
                                        : 'btn-light border-light-subtle text-muted opacity-50'
                                }`}
                            >
                                <i
                                    className={`fa-solid ${cat.faIcon} ${
                                        isActive ? 'text-white' : 'text-muted'
                                    } text-small mb-1`}
                                ></i>
                                <span
                                    className={`${isActive ? 'text-white' : 'text-muted'} text-truncate text-small w-100 px-1`}
                                >
                                    {cat.label}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
