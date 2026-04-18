const OVERPASS_ENDPOINTS = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

// Función segura para parsear JSON evitando HTML/XML
const safeJson = async (response) => {
    const text = await response.text();

    // Si Overpass devuelve HTML → error
    if (!text || text.trim().startsWith('<')) {
        throw new Error('Overpass devolvió HTML/XML en vez de JSON');
    }

    return JSON.parse(text);
};

async function queryOverpassProgressive(query) {
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

            const json = await safeJson(response);

            if (!json.elements) continue;

            return json.elements;
        } catch (error) {
            console.warn(`Fallo en ${endpoint}:`, error.message);
        }
    }

    throw new Error('Todos los endpoints de Overpass fallaron.');
}

export const fetchWheelchairPlacesProgressive = async (bbox, onPartialData) => {
    const [south, west, north, east] = bbox;

    // NODOS ligeros
    const q1 = `
        [out:json][timeout:25];
        node["wheelchair"](${south},${west},${north},${east});
        out body;
    `;
    try {
        const nodes = await queryOverpassProgressive(q1);
        onPartialData(nodes);
    } catch (err) {
        console.warn('Error cargando nodos:', err.message);
    }

    // WAYS pesados
    const q2 = `
        [out:json][timeout:25];
        way["wheelchair"](${south},${west},${north},${east});
        out body;
        >;
        out skel qt;
    `;
    try {
        const ways = await queryOverpassProgressive(q2);
        onPartialData(ways);
    } catch (err) {
        console.warn('Error cargando ways:', err.message);
    }

    // RELATIONS - muy pesados
    const q3 = `
        [out:json][timeout:25];
        relation["wheelchair"](${south},${west},${north},${east});
        out body;
        >;
        out skel qt;
    `;
    try {
        const relations = await queryOverpassProgressive(q3);
        onPartialData(relations);
    } catch (err) {
        console.warn('Error cargando relations:', err.message);
    }
};
