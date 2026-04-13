const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    // 'https://overpass.osm.ch/api/interpreter',
    // 'https://overpass.atownsend.org.uk/api/',
    // 'https://overpass.openstreetmap.fr/api/interpreter',
];

async function queryOverpass(query) {
    const body = new URLSearchParams({ data: query }).toString();

    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded;charset=UTF-8',
                    Accept: 'application/json',
                },
                body,
            });

            const text = await response.text();

            if (text.trimStart().startsWith('<')) continue;
            if (text.trimStart().startsWith('<!')) continue;

            const data = JSON.parse(text);

            if (!data.elements) continue;

            return data.elements;
        } catch (error) {
            console.warn(`Fallo en ${endpoint}:`, error.message);
        }
    }

    throw new Error('Todos los endpoints de Overpass fallaron.');
}

export async function fetchWheelchairPlaces(bbox) {
    const [south, west, north, east] = bbox;

    const query = `
    [out:json][timeout:25];
    (
      node["wheelchair"](${south},${west},${north},${east});
      way["wheelchair"](${south},${west},${north},${east});
    );
    out center;
  `;

    return queryOverpass(query);
}
