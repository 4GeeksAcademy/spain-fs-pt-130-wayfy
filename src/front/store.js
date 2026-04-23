export const initialStore = () => {
    const savedTheme = localStorage.getItem('theme');
    const savedShortcut = localStorage.getItem('showShortcut');
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
        theme: savedTheme || 'light',
        showShortcut: savedShortcut !== null ? savedShortcut === 'true' : false,
        isListening: false,
        isProcessing: false,
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

        case 'SET_THEME': {
            const newTheme = action.payload;
            localStorage.setItem('theme', newTheme);
            return {
                ...store,
                theme: newTheme,
            };
        }

        case 'TOGGLE_SHORTCUTS': {
            const newValue = !store.showShortcut;
            localStorage.setItem('showShortcut', newValue);
            return {
                ...store,
                showShortcut: newValue,
            };
        }

        case 'SET_LISTENING':
            return { ...store, isListening: action.payload };

        case 'SET_PROCESSING':
            return { ...store, isProcessing: action.payload };

        default:
            return store;
    }
}
