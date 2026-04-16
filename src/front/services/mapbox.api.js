export const getLocations = async (buscar, dispatch, currentView) => {
    try {
        const buscarLimpio = buscar.trim();
        if (!buscarLimpio) return {};

        const params = new URLSearchParams({
            access_token: import.meta.env.VITE_MAPBOX_TOKEN,
            types: 'poi,address,place',
            proximity: `${currentView.longitude},${currentView.latitude}`,
            autocomplete: 'true',
            language: 'es',
        });

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(buscarLimpio)}.json?${params}`,
        );

        if (!response.ok) throw new Error('Error al obtener ubicación');

        const data = await response.json();

        if (data?.features?.length > 0) {
            const [longitude, latitude] = data.features[0].center;

            const isAddress = data.features[0].place_type.includes('address');

            dispatch({
                type: 'UPDATE_LOCATION',
                payload: {
                    longitude,
                    latitude,
                    zoom: isAddress ? 18 : 14,
                },
            });

            dispatch({
                type: 'SET_SELECTED_LOCATION',
                payload: { longitude, latitude },
            });

            return { longitude, latitude };
        }
        return {};
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        return {};
    }
};
