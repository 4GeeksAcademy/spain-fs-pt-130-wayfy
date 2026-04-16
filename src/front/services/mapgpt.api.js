export const fetchMapData = async (text) => {
    if (!text || text.length < 3) return null;

    try {
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/mapgpt`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: text }),
            },
        );

        if (!response.ok) throw new Error('Error en el backend');
        const data = await response.json();

        const geocode = async (query) => {
            if (!query) return null;

            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query,
            )}&limit=1`;

            const res = await fetch(url, {
                headers: { 'User-Agent': 'WayfyAI/1.0' },
            });

            const json = await res.json();
            if (json.length === 0) return null;

            const lon = parseFloat(json[0].lon);
            const lat = parseFloat(json[0].lat);

            return {
                id: query,
                center: [lon, lat],
                geometry: {
                    type: 'Point',
                    coordinates: [lon, lat],
                },
                place_name: query,
                text: query,
            };
        };

        const feature =
            (await geocode(data.poi)) ||
            (await geocode(data.address)) ||
            (await geocode(data.place)) ||
            null;

        return {
            feature,
            filters: data.filters,
            categories: data.categories,
            message: data.message,
        };
    } catch (error) {
        console.error('Error en fetchMapData:', error);
        throw error;
    }
};
