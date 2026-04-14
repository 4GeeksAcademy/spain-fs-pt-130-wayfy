import React, { useRef, useEffect, useState, useCallback } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { useFilteredGeoJSON } from '../../hooks/useFilteredGeoJSON';
import Map, {
    GeolocateControl,
    Marker,
    NavigationControl,
    Source,
    Layer,
} from 'react-map-gl';

import { fetchWheelchairPlaces } from '../../services/overpass.api';
import { elementsToGeoJSON } from '../../utils/toGeoJSON';

import 'mapbox-gl/dist/mapbox-gl.css';
import './css/AccessibilityMap.css';
import { Legend } from './Legend';

// ── CONFIGURACIÓN DE CAPAS (LAYERS) ──────────────────────────────────────────

const clusterLayer = {
    id: 'clusters',
    type: 'circle',
    filter: ['has', 'point_count'],
    paint: {
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#10b891',
            10,
            '#38bdf8',
            50,
            '#ec8e8e',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
    },
};

const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol',
    filter: ['has', 'point_count'],
    layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 13,
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    },
    paint: { 'text-color': '#fff' },
};

const unclusteredLayer = {
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
};

export const AccessibilityMap = () => {
    const { store, dispatch } = useGlobalReducer();
    const { viewState, places, selectedLocation, activeFilters, activeCategories } = store;

    // ── ESTADOS LOCALES ──────────────────────────────────────────────────────
    const [userCoords, setUserCoords] = useState(null);
    const [geojson, setGeojson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cursor, setCursor] = useState('grab');
    const [isPositionReady, setIsPositionReady] = useState(false); // Bloqueador de API inteligente

    const mapRef = useRef(null);
    const debounceRef = useRef(null);

    // Filtro mejorado con categorías
    const filteredGeoJSON = useFilteredGeoJSON(geojson, activeFilters, activeCategories);

    // ── ACCIONES ─────────────────────────────────────────────────────────────

    const updateLocation = useCallback(
        (newViewState) => {
            dispatch({ type: 'UPDATE_LOCATION', payload: newViewState });
        },
        [dispatch],
    );

    const loadData = useCallback(
        async () => {
            const map = mapRef.current?.getMap()
            // No buscar si la posición no está lista (GPS o Selección)
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

            try {
                const elements = await fetchWheelchairPlaces(bbox);
                setGeojson(elementsToGeoJSON(elements));
            } catch (err) {
                console.error(err);
                setError('Error al cargar datos de accesibilidad.');
            } finally {
                setLoading(false);
            }
        },
        [isPositionReady],
    );

    // ── EFECTOS DE UBICACIÓN Y CARGA ─────────────────────────────────────────

    // Efecto inicial: Detectar posición antes de cargar nada
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
                (err) => {
                    console.error('Error de geolocalización:', err);
                    setIsPositionReady(true);
                },
                { enableHighAccuracy: true, timeout: 5000 },
            );
        } else {
            setIsPositionReady(true);
        }
    }, [selectedLocation]);

    // Cargar lugares cuando la posición esté lista o los filtros cambien
    useEffect(() => {
        if (isPositionReady && mapRef.current) {
            loadData();
        }
    }, [isPositionReady, loadData]);

    // Volar a un lugar seleccionado externamente
    useEffect(() => {
        if (selectedLocation && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedLocation.longitude, selectedLocation.latitude],
                zoom: 14,
                essential: true,
                duration: 2000,
            });
        }
    }, [selectedLocation]);

    // Limpiar errores automáticamente
    useEffect(() => {
        const zoomErrorMessage = 'Acércate más para ver lugares accesibles.'

        if (error && error !== zoomErrorMessage) {
            const timer = setTimeout(() => {
                setError(null);
            }, 2000); // 2 segundos

            return () => clearTimeout(timer); // Limpieza si el componente se desmonta o el error cambia
        }
    }, [error]);

    // ── HANDLERS ─────────────────────────────────────────────────────────────

    const handleMove = useCallback(
        (evt) => updateLocation(evt.viewState),
        [updateLocation],
    );

    const handleMoveEnd = useCallback(
        (evt) => {
            if (!isPositionReady) return;
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => loadData(), 600);
        },
        [loadData, isPositionReady],
    );

    const handleClick = useCallback(
        (evt) => {
            const map = mapRef.current?.getMap();
            if (!map) return;

            const clusters = map.queryRenderedFeatures(evt.point, { layers: ['clusters'] });
            if (clusters.length) {
                const clusterId = clusters[0].properties.cluster_id;
                map.getSource('wheelchair').getClusterExpansionZoom(clusterId, (error, zoom) => {
                    if (error) return;
                    map.easeTo({ center: clusters[0].geometry.coordinates, zoom });
                });
                return;
            }

            const points = map.queryRenderedFeatures(evt.point, { layers: ['unclustered-point'] });
            if (points.length) {
                dispatch({ type: 'SET_SELECTED_FEATURE', payload: points[0] });
            }
        },
        [dispatch],
    );

    return (
        <div className="w-100 h-100 position-relative overflow-hidden">
            {/* INDICADOR DE CARGA */}
            {loading && (
                <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-1">
                    <div className="alert alert-light shadow-sm border-0 d-flex align-items-center rounded-pill px-4 py-2 gap-3">
                        <div className="spinner-border spinner-border-sm text-primary"></div>
                        <span className="text-small fw-bold text-primary">Buscando lugares accesibles cercanos...</span>
                    </div>
                </div>
            )}

            {/* AVISO DE ERROR / ZOOM */}
            {!loading && error && (
                <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-1">
                    <div className="alert alert-warning border-0 shadow-sm py-2 px-4 small fw-bold rounded-pill">
                        <i className="fa-solid fa-circle-exclamation me-2"></i><span className="text-small">{error}</span>
                    </div>
                </div>
            )}

            <Legend />

            <Map
                ref={mapRef}
                {...viewState}
                cursor={cursor}
                onMove={handleMove}
                onMoveEnd={handleMoveEnd}
                onClick={handleClick}
                onMouseEnter={() => setCursor('pointer')}
                onMouseLeave={() => setCursor('grab')}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                interactiveLayerIds={['clusters', 'unclustered-point']}
            >
                <GeolocateControl position="top-left" trackUserLocation showUserHeading />
                <NavigationControl position="top-left" />

                {/* FUENTE DE DATOS ACCESIBILIDAD (Clusters + Unclustered) */}
                {filteredGeoJSON && (
                    <Source
                        id="wheelchair"
                        type="geojson"
                        data={filteredGeoJSON}
                        cluster={true}
                        clusterMaxZoom={14}
                        clusterRadius={50}
                    >
                        <Layer {...clusterLayer} />
                        <Layer {...clusterCountLayer} />
                        <Layer {...unclusteredLayer} />
                    </Source>
                )}

                {/* MARCADOR POSICIÓN USUARIO (Punto Azul) */}
                {userCoords && (
                    <Marker longitude={userCoords.longitude} latitude={userCoords.latitude} anchor="center">
                        <i className="fa-solid fa-circle-dot text-primary fs-5"></i>
                    </Marker>
                )}

                {/* MARCADOR SELECCIONADO */}
                {selectedLocation && (
                    <Marker longitude={selectedLocation.longitude} latitude={selectedLocation.latitude} anchor="bottom">
                        {/* <i className="fa-solid fa-location-dot text-danger fs-2"></i> */}
                    </Marker>
                )}

                {/* MARCADORES GUARDADOS POR EL USUARIO */}
                {places?.map((place) => (
                    <Marker key={place.id} longitude={place.longitude} latitude={place.latitude} anchor="bottom">
                        <i className="marker-wayfy shadow-sm" title={place.name}></i>
                    </Marker>
                ))}
            </Map>
        </div>
    );
};