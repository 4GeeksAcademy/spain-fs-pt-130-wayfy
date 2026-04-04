export const getLocations = async (buscar, dispatch) => {
    try {
        const buscarLimpio = buscar.trim();

        if (!buscarLimpio) return {};

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(buscar)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`,
        );

        if (!response.ok) throw new Error('Error al obtener ubicación');

        const data = await response.json();

        if (data?.features?.length > 0) {
            const [longitude, latitude] = data.features[0].center;

            dispatch({
                type: 'UPDATE_LOCATION',
                payload: {
                    longitude,
                    latitude,
                    zoom: 14,
                },
            });

            return { longitude, latitude };
        }

        return {};
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        return {};
    }
};
