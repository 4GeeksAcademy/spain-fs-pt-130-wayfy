import React from "react";

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

const CATEGORY_COLORS = {
    gastronomia: "#ff6b6b", alojamiento: "#4dabf7", transporte: "#845ef7",
    salud: "#ff922b", cultura_turismo: "#20c997", recreacion: "#51cf66",
    deporte: "#339af0", gobierno: "#adb5bd", baños: "#15aabf",
    dinero: "#fcc419", tiendas: "#e64980", otros: "#868e96"
};

export const CategorySelector = ({ value, onChange, availableCategories = null, isMultiple = false }) => {
    const categoriesToRender = availableCategories
        ? PLACE_CATEGORIES.filter(cat => availableCategories.includes(cat.value))
        : PLACE_CATEGORIES;

    const handleSelect = (catValue) => {
        if (isMultiple) {
            const newValue = value.includes(catValue)
                ? value.filter(v => v !== catValue)
                : [...value, catValue];
            onChange(newValue);
        } else {
            onChange(catValue);
        }
    };

    return (
        <section className="mb-3">
            <h6 className="text-primary mb-3">
                {isMultiple ? "Filtrar" : "Seleccionar Categoría"}
            </h6>
            <div className={`row g-2 ${isMultiple ? 'flex-column' : ''}`}>
                {categoriesToRender.map((cat) => {
                    const isActive = isMultiple ? value.includes(cat.value) : value === cat.value;
                    const catColor = CATEGORY_COLORS[cat.value] || "#868e96";

                    return (
                        <div key={cat.value} className={`${isMultiple ? 'col-12' : 'col-3 col-md-2'}`}>
                            <button
                                type="button"
                                onClick={() => handleSelect(cat.value)}
                                className={`d-flex flex-column btn btn-sm w-100 d-flex align-items-center py-2 px-3 border-2 rounded-2 transition-all shadow-none
                                    ${isActive ? 'text-white fw-bold shadow-sm' : 'btn-light border-light-subtle text-muted opacity-75'}`}
                                style={{
                                    fontSize: '0.8rem',
                                    backgroundColor: isActive ? catColor : '',
                                    borderColor: isActive ? catColor : '',
                                }}
                            >
                                <i className={`fa-solid ${cat.faIcon} me-2 ${isActive ? 'text-white' : ''}`}></i>
                                <span className="text-truncate w-100" style={{ fontSize: '0.8rem' }}>{cat.label}</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};