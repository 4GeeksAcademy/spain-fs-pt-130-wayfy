import { useRef, useEffect, useState, useCallback } from 'react';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import Map, {
    FullscreenControl,
    GeolocateControl,
    Marker,
    NavigationControl,
    ScaleControl,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxComponent.css';

export const MapboxComponent = () => {
    const { store, dispatch } = useGlobalReducer();
    const { viewState, places, selectedLocation } = store;

    // Coordenadas de posición actual
    const [userCoords, setUserCoords] = useState(null);

    // Estados para el modal
    const [showModal, setShowModal] = useState(false);
    const [tempCoords, setTempCoords] = useState(null); // Coordenadas del clic derecho
    const [placeName, setPlaceName] = useState('');

    const mapRef = useRef(null);

    const updateLocation = useCallback(
        (newViewState) => {
            dispatch({ type: 'UPDATE_LOCATION', payload: newViewState });
        },
        [dispatch],
    );

    useEffect(() => {
        if (selectedLocation) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    setUserCoords({ longitude, latitude });

                    mapRef.current?.flyTo({
                        center: [longitude, latitude],
                        zoom: 14,
                        duration: 2000,
                    });

                    updateLocation({
                        ...viewState,
                        longitude,
                        latitude,
                        zoom: 14,
                    });
                },
                (error) => console.error('Error obteniendo ubicación:', error),
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                },
            );
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (selectedLocation && mapRef.current) {
            const { longitude, latitude } = selectedLocation;

            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 16,
                essential: true,
                duration: 2000,
                curve: 1.5,
            });
        }
    }, [selectedLocation]);

    // Clic derecho
    const handleContextMenu = (evt) => {
        evt.originalEvent.preventDefault();
        const { lng, lat } = evt.lngLat;

        setTempCoords({ longitude: lng, latitude: lat });
        setShowModal(true);
    };

    const handleSavePlace = () => {
        if (!placeName.trim()) return;

        dispatch({
            type: 'ADD_PLACE',
            payload: {
                id: Date.now(),
                name: placeName,
                longitude: tempCoords.longitude,
                latitude: tempCoords.latitude,
            },
        });

        setShowModal(false);
        setPlaceName('');
        setTempCoords(null);
    };

    return (
        <div className="w-100 h-100 position-relative">
            {showModal && (
                <div className="modal-overlay">
                    <div className="custom-modal p-4 shadow bg-white rounded">
                        <h5>Nuevo Marcador</h5>

                        <p className="small text-muted m-0">
                            Lat: {tempCoords?.latitude}
                        </p>
                        <p className="small text-muted m-0">
                            Lng: {tempCoords?.longitude}
                        </p>

                        <input
                            className="form-control my-3"
                            placeholder="Nombre del lugar..."
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                            autoFocus
                        />
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-light"
                                onClick={() => {
                                    setShowModal(false);
                                    setTempCoords(null);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSavePlace}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt) => updateLocation(evt.viewState)}
                onContextMenu={handleContextMenu}
                className="mapa"
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
                <GeolocateControl
                    position="top-right"
                    trackUserLocation={true}
                    showUserHeading={true}
                />
                <NavigationControl position="top-right" />
                <FullscreenControl />
                <ScaleControl />

                {/* Marcador temporal naranja */}
                {tempCoords && (
                    <Marker
                        longitude={tempCoords.longitude}
                        latitude={tempCoords.latitude}
                        color="orange"
                    />
                )}

                {/* Marcador de Mi Ubicación */}
                {userCoords && (
                    <Marker
                        longitude={userCoords.longitude}
                        latitude={userCoords.latitude}
                        anchor="center"
                        color="blue"
                    />
                )}

                {/* Marcador de Búsqueda */}
                {selectedLocation && (
                    <Marker
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        color="red"
                    />
                )}

                {/* Lugares guardados */}
                {places &&
                    places.map((place) => (
                        <Marker
                            key={place.id}
                            longitude={place.longitude}
                            latitude={place.latitude}
                            anchor="bottom"
                        >
                            <div className="marcador" title={place.name} />
                        </Marker>
                    ))}
            </Map>
        </div>
    );
};
