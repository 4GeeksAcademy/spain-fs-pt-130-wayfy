const OVERPASS_ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter',
    'https://overpass.osm.ch/api/interpreter',
];

export const queryOverpass = async (query) => {
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
};

export const fetchWheelchairPlacesProgressive = async (bbox, onPartialData) => {
    const [south, west, north, east] = bbox;

    // NODOS rápidos
    const q1 = `
        [out:json][timeout:25];
        node["wheelchair"](${south},${west},${north},${east});
        out body;
    `;
    const nodes = await queryOverpass(q1);
    onPartialData(nodes);

    // WAYS más pesados
    const q2 = `
        [out:json][timeout:25];
        way["wheelchair"](${south},${west},${north},${east});
        out body;
        >;
        out skel qt;
    `;
    const ways = await queryOverpass(q2);
    onPartialData(ways);

    // RELATIONS pesa mucho
    const q3 = `
        [out:json][timeout:25];
        relation["wheelchair"](${south},${west},${north},${east});
        out body;
        >;
        out skel qt;
    `;
    const relations = await queryOverpass(q3);
    onPartialData(relations);
};
