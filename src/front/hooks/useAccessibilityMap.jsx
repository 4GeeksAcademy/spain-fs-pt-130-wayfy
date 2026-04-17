import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import useGlobalReducer from './useGlobalReducer';
import useFilteredGeoJSON from './useFilteredGeoJSON';
import { fetchWheelchairPlacesProgressive } from '../services/overpass.api';
import { elementsToGeoJSON } from '../utils/toGeoJSON';

const useAccessibilityMap = () => {
    const { store, dispatch } = useGlobalReducer();
    const {
        viewState,
        places,
        selectedLocation,
        activeFilters,
        activeCategories,
    } = store;

    const [userCoords, setUserCoords] = useState(null);
    const [geojson, setGeojson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cursor, setCursor] = useState('grab');
    const [isPositionReady, setIsPositionReady] = useState(false);

    const mapRef = useRef(null);
    const debounceRef = useRef(null);

    // Filtro de GeoJSON
    const filteredGeoJSON = useFilteredGeoJSON(
        geojson,
        activeFilters,
        activeCategories,
    );

    // ⭐ CAPAS DEL MAPA (cluster, halo, puntos)
    const layers = useMemo(
        () => ({
            clusterHaloLayer: {
                id: 'cluster-halo',
                type: 'circle',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        32,
                        10, 42,
                        50, 54
                    ],
                    'circle-color': 'rgba(0,0,0,0.12)',
                },
            },

            clusterLayer: {
                id: 'clusters',
                type: 'circle',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#10b891',
                        10, '#38bdf8',
                        50, '#ec8e8e',
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        24,
                        10, 32,
                        50, 44
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff',
                },
            },

            clusterCountLayer: {
                id: 'cluster-count',
                type: 'symbol',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-size': 14,
                    'text-font': [
                        'DIN Offc Pro Medium',
                        'Arial Unicode MS Bold',
                    ],
                },
                paint: {
                    'text-color': '#ffffff',
                    'text-halo-color': 'rgba(0,0,0,0.35)',
                    'text-halo-width': 2,
                },
            },

            unclusteredLayer: {
                id: 'unclustered-point',
                type: 'circle',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-radius': 9,
                    'circle-color': [
                        'match',
                        ['get', 'wheelchair'],
                        'yes', '#10b891',
                        'limited', '#ffc108',
                        'no', '#db3545',
                        '#93a2b8',
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff',
                },
            },
        }),
        [],
    );

    const updateLocation = useCallback(
        (newViewState) => {
            dispatch({ type: 'UPDATE_LOCATION', payload: newViewState });
        },
        [dispatch],
    );

    // ⭐ CARGA PROGRESIVA DE POIs
    const loadData = useCallback(async () => {
        const map = mapRef.current?.getMap();
        if (!map || !isPositionReady) return;

        if (map.getZoom() < 14) {
            setGeojson(null);
            setError('Acércate más para ver lugares accesibles.');
            return;
        }

        const b = map.getBounds();
        const bbox = [b.getSouth(), b.getWest(), b.getNorth(), b.getEast()];

        setLoading(true);
        setError(null);

        let allElements = [];

        try {
            await fetchWheelchairPlacesProgressive(bbox, (partial) => {
                allElements = [...allElements, ...partial];
                setGeojson(elementsToGeoJSON(allElements)); // 🔥 actualización progresiva
            });

        } catch (err) {
            console.error(err);
            setError('Error al cargar datos de accesibilidad.');
        } finally {
            setLoading(false);
        }
    }, [isPositionReady]);

    // ⭐ Actualización dinámica al cambiar filtros
    useEffect(() => {
        if (filteredGeoJSON && mapRef.current) {
            const map = mapRef.current.getMap();
            const src = map.getSource('wheelchair');
            if (src) src.setData(filteredGeoJSON);
        }
    }, [filteredGeoJSON]);

    // ⭐ Geolocalización inicial
    useEffect(() => {
        if (selectedLocation) {
            setIsPositionReady(true);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setUserCoords({ longitude, latitude });

                    mapRef.current?.flyTo({
                        center: [longitude, latitude],
                        zoom: 14,
                        duration: 1500,
                    });

                    updateLocation({
                        ...viewState,
                        longitude,
                        latitude,
                        zoom: 14,
                    });
                    setIsPositionReady(true);
                },
                () => setIsPositionReady(true),
                { enableHighAccuracy: true, timeout: 5000 },
            );
        } else {
            setIsPositionReady(true);
        }
    }, []);

    useEffect(() => {
        if (isPositionReady && mapRef.current) {
            loadData();
        }
    }, [isPositionReady, loadData]);

    // ⭐ Animación suave al centrar en selectedLocation
    useEffect(() => {
        if (selectedLocation && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedLocation.longitude, selectedLocation.latitude],
                zoom: 14,
                essential: true,
                duration: 2000,
                easing: (t) => t * (2 - t),
            });
        }
    }, [selectedLocation]);

    useEffect(() => {
        const zoomErrorMessage = 'Acércate más para ver lugares accesibles.';
        if (error && error !== zoomErrorMessage) {
            const timer = setTimeout(() => setError(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleMove = useCallback(
        (evt) => updateLocation(evt.viewState),
        [updateLocation],
    );

    const handleMoveEnd = useCallback(() => {
        if (!isPositionReady) return;
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => loadData(), 600);
    }, [loadData, isPositionReady]);

    // ⭐ Click en clusters o puntos
    const handleClick = useCallback(
        (evt) => {
            const map = mapRef.current?.getMap();
            if (!map) return;

            const clusters = map.queryRenderedFeatures(evt.point, {
                layers: ['clusters'],
            });

            if (clusters.length) {
                const clusterId = clusters[0].properties.cluster_id;

                map.getSource('wheelchair').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;
                        map.easeTo({
                            center: clusters[0].geometry.coordinates,
                            zoom,
                            duration: 1200,
                            easing: (t) => t * (2 - t),
                        });
                    },
                );
                return;
            }

            const points = map.queryRenderedFeatures(evt.point, {
                layers: ['unclustered-point'],
            });
            if (points.length) {
                dispatch({ type: 'SET_SELECTED_FEATURE', payload: points[0] });
            }
        },
        [dispatch],
    );

    // ⭐ Hover highlight
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map) return;

        const handleEnterPoint = () => {
            map.setPaintProperty('unclustered-point', 'circle-stroke-color', '#000');
        };

        const handleLeavePoint = () => {
            map.setPaintProperty('unclustered-point', 'circle-stroke-color', '#fff');
        };

        map.on('mouseenter', 'unclustered-point', handleEnterPoint);
        map.on('mouseleave', 'unclustered-point', handleLeavePoint);

        return () => {
            map.off('mouseenter', 'unclustered-point', handleEnterPoint);
            map.off('mouseleave', 'unclustered-point', handleLeavePoint);
        };
    }, [mapRef]);

    return {
        state: {
            viewState,
            userCoords,
            filteredGeoJSON,
            loading,
            error,
            cursor,
            places,
            selectedLocation,
            layers,
        },
        actions: {
            setCursor,
            handleMove,
            handleMoveEnd,
            handleClick,
        },
        mapRef,
    };
};

export default useAccessibilityMap;
