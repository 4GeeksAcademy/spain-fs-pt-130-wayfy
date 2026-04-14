export const elementsToGeoJSON = (elements) => {
    const features = elements
        .filter((element) => element.lat || element.center)
        .map((element) => {
            const tag = element.tags ?? {};

            let category = 'otros';

            // GASTRONOMIA
            if (
                tag.amenity === 'restaurant' ||
                tag.amenity === 'cafe' ||
                tag.amenity === 'bar' ||
                tag.amenity === 'pub' ||
                tag.amenity === 'fast_food' ||
                tag.amenity === 'ice_cream' ||
                tag.amenity === 'food_court'
            ) {
                category = 'gastronomia';
            }
            // ALOJAMIENTO
            else if (
                tag.tourism === 'hotel' ||
                tag.tourism === 'hostel' ||
                tag.tourism === 'apartment' ||
                tag.tourism === 'motel' ||
                tag.tourism === 'guest_house' ||
                tag.tourism === 'camp_site'
            ) {
                category = 'alojamiento';
            }
            // TRANSPORTE
            else if (
                tag.highway === 'bus_stop' ||
                tag.amenity === 'bus_station' ||
                tag.public_transport ||
                tag.amenity === 'taxi' ||
                tag.railway === 'station' ||
                tag.railway === 'subway_entrance' ||
                tag.amenity === 'parking' ||
                tag.amenity === 'bicycle_parking'
            ) {
                category = 'transporte';
            }
            // TURISMO (Categoría Agrupada)
            else if (
                tag.tourism === 'museum' ||
                tag.tourism === 'art_gallery' ||
                tag.amenity === 'arts_centre' ||
                tag.amenity === 'theatre' ||
                tag.amenity === 'cinema' ||
                tag.amenity === 'library' ||
                tag.amenity === 'community_centre' ||
                tag.amenity === 'place_of_worship' ||
                tag.tourism === 'viewpoint' ||
                tag.tourism === 'attraction' ||
                tag.tourism === 'information' ||
                tag.tourism === 'picnic_site' ||
                tag.heritage ||
                tag.historic
            ) {
                category = 'cultura_turismo';
            }
            // OCIO
            else if (
                tag.leisure === 'park' ||
                tag.leisure === 'playground' ||
                tag.leisure === 'garden' ||
                tag.amenity === 'nightclub' ||
                tag.leisure === 'recreation_ground' ||
                tag.leisure === 'common'
            ) {
                category = 'recreacion';
            }
            // GOBIERNO / SERVICIOS PÚBLICOS
            else if (
                tag.amenity === 'townhall' ||
                tag.amenity === 'courthouse' ||
                tag.amenity === 'embassy' ||
                tag.office === 'government' ||
                tag.amenity === 'police' ||
                tag.amenity === 'post_office' ||
                tag.amenity === 'fire_station'
            ) {
                category = 'gobierno';
            }
            // SALUD
            else if (
                tag.amenity === 'hospital' ||
                tag.amenity === 'clinic' ||
                tag.amenity === 'pharmacy' ||
                tag.healthcare ||
                tag.amenity === 'dentist' ||
                tag.amenity === 'doctors' ||
                tag.amenity === 'social_facility'
            ) {
                category = 'salud';
            }
            // DINERO
            else if (
                tag.amenity === 'bank' ||
                tag.amenity === 'atm' ||
                tag.amenity === 'bureau_de_change'
            ) {
                category = 'dinero';
            }
            // DEPORTE
            else if (
                tag.sport ||
                tag.leisure === 'sports_centre' ||
                tag.leisure === 'stadium' ||
                tag.leisure === 'pitch' ||
                tag.leisure === 'swimming_pool' ||
                tag.leisure === 'fitness_centre'
            ) {
                category = 'deporte';
            }
            // BAÑOS
            else if (tag.amenity === 'toilets') {
                category = 'baños';
            }
            // TIENDAS
            else if (tag.shop) {
                category = 'tiendas';
            }

            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        element.lon ?? element.center.lon,
                        element.lat ?? element.center.lat,
                    ],
                },
                properties: {
                    id: element.id,
                    category: category,
                    name:
                        tag.name ??
                        tag['name:es'] ??
                        tag.brand ??
                        'Lugar sin nombre',

                    // Accesibilidad
                    wheelchair: tag.wheelchair ?? 'unknown',
                    wheelchair_desc:
                        tag['wheelchair:description'] ??
                        tag['wheelchair:description:es'] ??
                        null,

                    // Contacto y Horarios
                    contact: {
                        phone: tag.phone ?? tag['contact:phone'] ?? null,
                        website: tag.website ?? tag['contact:website'] ?? null,
                        email: tag.email ?? tag['contact:email'] ?? null,
                        opening_hours: tag.opening_hours ?? null,
                        address: tag['addr:street']
                            ? `${tag['addr:street']} ${tag['addr:housenumber'] ?? ''}`
                            : null,
                    },

                    sub_type:
                        tag.amenity ??
                        tag.shop ??
                        tag.tourism ??
                        tag.leisure ??
                        tag.office ??
                        tag.healthcare ??
                        'punto de interés',
                    osm_type: element.type,

                    all_tags: tag,
                },
            };
        });

    return { type: 'FeatureCollection', features };
};
