import React from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';

// --- CONFIGURACIÓN DE FILTROS ---

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
    {
        value: 'no',
        label: 'No',
        color: 'danger',
        faIcon: 'fa-solid fa-ban',
    },
    {
        value: 'unknown',
        label: '?',
        color: 'secondary',
        faIcon: 'fa-solid fa-circle-question',
    },
];

const PLACE_CATEGORIES = [
    { value: 'alojamiento', label: 'Alojamientos', faIcon: 'fa-bed' },
    { value: 'gastronomia', label: 'Gastronomía', faIcon: 'fa-utensils' },
    { value: 'transporte', label: 'Transporte', faIcon: 'fa-bus' },
    { value: 'salud', label: 'Salud', faIcon: 'fa-house-medical' },
    { value: 'cultura_turismo', label: 'Turismo', faIcon: 'fa-landmark-flag', },
    { value: 'recreacion', label: 'Ocio', faIcon: 'fa-champagne-glasses' },
    { value: 'deporte', label: 'Deporte', faIcon: 'fa-volleyball' },
    { value: 'gobierno', label: 'Oficinas', faIcon: 'fa-building-columns' },
    { value: 'baños', label: 'Baños', faIcon: 'fa-restroom' },
    { value: 'dinero', label: 'Bancos', faIcon: 'fa-money-bill-transfer' },
    { value: 'tiendas', label: 'Tiendas', faIcon: 'fa-bag-shopping' },
    { value: 'otros', label: 'Otros', faIcon: 'fa-ellipsis' },
];

export const FilterPanel = () => {
    const { store, dispatch } = useGlobalReducer();
    const { activeFilters = [], activeCategories = [] } = store;

    const toggle = (currentArray, value, actionType) => {
        const newValues = currentArray.includes(value)
            ? currentArray.length > 1
                ? currentArray.filter((v) => v !== value)
                : currentArray
            : [...currentArray, value];

        dispatch({ type: actionType, payload: newValues });
    };

    const handleSelectAll = (actionType, list, isAll) => {
        dispatch({
            type: actionType,
            payload: isAll ? list.map((i) => i.value) : [list[0].value],
        });
    };

    return (
        <div className="filter-panel d-flex flex-column gap-3 p-1">
            {/* --- SECCIÓN: ACCESIBILIDAD --- */}
            <section>
                <h6 className="text-primary">Accesibilidad</h6>

                <div className="d-flex gap-1">
                    {ACCESSIBILITY_FILTERS.map((f) => {
                        const isActive = activeFilters.includes(f.value);
                        return (
                            <button
                                key={f.value}
                                onClick={() =>
                                    toggle(
                                        activeFilters,
                                        f.value,
                                        'SET_ACTIVE_FILTERS',
                                    )
                                }
                                className={`btn btn-sm flex-fill d-flex flex-column align-items-center py-2 border-2 rounded-2 
                                    ${isActive
                                        ? `btn-${f.color} text-white fw-bold shadow-sm`
                                        : 'btn-light border-light-subtle text-muted fw-bold opacity-50'
                                    }`}
                            >
                                <i
                                    className={`${f.faIcon} mb-1`}
                                ></i>
                                <span className='text-small'>
                                    {f.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* --- SECCIÓN: CATEGORÍAS DE LUGARES --- */}
            <section>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-primary m-0">Categorías</h6>
                    <button
                        onClick={() =>
                            handleSelectAll(
                                'SET_ACTIVE_CATEGORIES',
                                PLACE_CATEGORIES,
                                activeCategories.length !==
                                PLACE_CATEGORIES.length,
                            )
                        }
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
                            <div key={cat.value} className="col-4">
                                <button
                                    onClick={() =>
                                        toggle(
                                            activeCategories,
                                            cat.value,
                                            'SET_ACTIVE_CATEGORIES',
                                        )
                                    }
                                    className={`btn btn-sm w-100 d-flex flex-column align-items-center py-2 border-2 rounded-2 ${isActive
                                        ? 'btn-success border-success text-primary fw-bold shadow-sm'
                                        : 'btn-light border-light-subtle text-muted opacity-50'
                                        }`}
                                >
                                    <i
                                        className={`fa-solid ${cat.faIcon} ${isActive ? 'text-white' : 'text-muted'} text-small  mb-1`}
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
        </div>
    );
}
