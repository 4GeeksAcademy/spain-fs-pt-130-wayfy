export const initialStore = () => {
    return {
        viewState: {
            longitude: -3.7038,
            latitude: 40.4168,
            zoom: 14,
        },
        places: [],
        favorites: [],
        selectedLocation: null,
        // ['yes', 'limited', 'no', 'unknown'],
        activeFilters: ['yes', 'limited'],
        activeCategories: [
            'gastronomia',
            'alojamiento',
            'transporte',
            'salud',
            'cultura_turismo',
            'recreacion',
            'deporte',
            'gobierno',
            'baños',
            'dinero',
            'tiendas',
            'otros',
        ],
        selectedFeature: null,
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'UPDATE_LOCATION':
            return {
                ...store,
                viewState: { ...store.viewState, ...action.payload },
            };

        case 'SET_SELECTED_LOCATION':
            return { ...store, selectedLocation: action.payload };

        case 'ADD_PLACE':
            return { ...store, places: [...store.places, action.payload] };
        case 'REMOVE_PLACE':
            return {
                ...store,
                places: store.places.filter((p) => p.id !== action.payload),
            };

        case 'ADD_FAVORITE':
            return {
                ...store,
                favorites: [...store.favorites, action.payload],
            };
        case 'REMOVE_FAVORITE':
            return {
                ...store,
                favorites: store.favorites.filter(
                    (fav) => fav.id !== action.payload,
                ),
            };

        case 'SET_ACTIVE_FILTERS':
            return { ...store, activeFilters: action.payload };
        case 'SET_ACTIVE_CATEGORIES':
            return { ...store, activeCategories: action.payload };

        case 'SET_SELECTED_FEATURE':
            return { ...store, selectedFeature: action.payload };
        default:
            return store;
    }
}
