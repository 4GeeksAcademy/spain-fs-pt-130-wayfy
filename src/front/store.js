export const initialStore = () => {
    return {
        viewState: {
            longitude: -3.7038,
            latitude: 40.4168,
            zoom: 14,
        },
        places: [
            {
                id: 1,
                name: 'Llano',
                longitude: -4.940194453558348,
                latitude: 37.75919846880028,
            },
            {
                id: 2,
                name: 'Plaza de España',
                longitude: -4.944112969008813,
                latitude: 37.758442421009065,
            },
            {
                id: 3,
                name: 'Ayuntamiento',
                longitude: -4.944699104585624,
                latitude: 37.757597352694916,
            },
        ],
    };
};

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case 'UPDATE_LOCATION':
            return {
                ...store,
                viewState: {
                    ...store.viewState,
                    ...action.payload,
                },
            };

        default:
            throw Error('Unknown action.');
    }
}
