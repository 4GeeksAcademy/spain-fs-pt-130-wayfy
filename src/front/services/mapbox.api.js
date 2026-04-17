export const getLocations = async (search, dispatch, currentView) => {
    try {
        const searchClean = search.trim();
        if (!searchClean) return [];

        if (searchClean.split(' ').length < 2) {
            return [];
        }

        const params = new URLSearchParams({
            access_token: import.meta.env.VITE_MAPBOX_TOKEN,
            types: 'poi,address,place',
            proximity: `${currentView.longitude},${currentView.latitude}`,
            language: 'es',
        });

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchClean)}.json?${params}`,
        );

        if (!response.ok) throw new Error('Error al obtener ubicación');

        const data = await response.json();

        return data?.features ?? [];
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        return [];
    }
};
