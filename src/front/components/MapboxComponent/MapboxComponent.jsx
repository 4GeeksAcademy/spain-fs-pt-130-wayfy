import { useRef, useEffect, useState } from 'react'
import useGlobalReducer from '../../hooks/useGlobalReducer'
import Map, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxComponent.css'

export const MapboxComponent = () => {
    const { store, dispatch } = useGlobalReducer()
    const { viewState, places, selectedLocation } = store
    const [loading, setLoading] = useState(true)
    const [userCoords, setUserCoords] = useState(null)

    // --- ESTADOS PARA LA MODAL Y NUEVO MARCADOR ---
    const [showModal, setShowModal] = useState(false)
    const [tempCoords, setTempCoords] = useState(null) // Coordenadas del clic derecho
    const [placeName, setPlaceName] = useState("")

    const mapRef = useRef(null)

    const updateLocation = (newViewState) => {
        dispatch({ type: 'UPDATE_LOCATION', payload: newViewState })
    }

    useEffect(() => {
        if (selectedLocation) {
            setLoading(false);
            return;
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(posicion => {
                const { longitude, latitude } = posicion.coords;
                setUserCoords({ longitude, latitude })
                updateLocation({ ...viewState, longitude, latitude, zoom: 14 })
                setLoading(false)
            },
                error => { setLoading(false) },
                { enableHighAccuracy: true }
            )
        } else { setLoading(false) }
    }, [selectedLocation]);

    // --- MANEJO DEL CLIC DERECHO ---
    const handleContextMenu = (e) => {
        e.preventDefault();
        const { lng, lat } = e.lngLat;
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
                latitude: tempCoords.latitude
            }
        });

        // Limpiar y cerrar
        setShowModal(false);
        setPlaceName("");
        setTempCoords(null);
    };

    return (
        <div className='w-100 h-100 position-relative'>
            {loading && !selectedLocation && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white" style={{ zIndex: 99 }}>
                    <div className="spinner-border text-primary mb-3" />
                    <p className="fw-bold text-secondary">Cargando ubicación actual...</p>
                </div>
            )}

            {/* Modal Sencilla (Bootstrap) */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="custom-modal p-4 shadow bg-white rounded">
                        <h5>Nuevo Marcador</h5>
                        {/* Corregido: Usar tempCoords que es el estado que tiene la info */}
                        <p className="small text-muted">
                            Lat: {tempCoords?.latitude.toFixed(4)} Lng: {tempCoords?.longitude.toFixed(4)}
                        </p>
                        <input
                            className="form-control mb-3"
                            placeholder="Nombre del lugar..."
                            value={placeName} // Corregido: Usar placeName
                            onChange={(e) => setPlaceName(e.target.value)} // Corregido: setPlaceName
                            autoFocus
                        />
                        <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-light" onClick={() => {
                                setShowModal(false);
                                setTempCoords(null); // Limpiar marcador naranja al cancelar
                            }}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={handleSavePlace}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Map
                ref={mapRef}
                {...viewState}
                onMove={evt => updateLocation(evt.viewState)}
                onContextMenu={handleContextMenu}
                className='mapa'
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
                <GeolocateControl position="top-right" />

                {/* Marcador temporal naranja */}
                {tempCoords && (
                    <Marker longitude={tempCoords.longitude} latitude={tempCoords.latitude} color="orange" />
                )}

                {/* Marcador de Mi Ubicación */}
                {userCoords && (
                    <Marker longitude={userCoords.longitude} latitude={userCoords.latitude} anchor='center'>
                        <div className="user-dot" />
                    </Marker>
                )}

                {/* Marcador de Búsqueda */}
                {selectedLocation && (
                    <Marker longitude={selectedLocation.longitude} latitude={selectedLocation.latitude} color='red' />
                )}

                {/* Lugares guardados */}
                {places && places.map(place => (
                    <Marker
                        key={place.id}
                        longitude={place.longitude}
                        latitude={place.latitude}
                        anchor='bottom'
                    >
                        <div className='marcador' title={place.name} />
                    </Marker>
                ))}
            </Map>
        </div>
    );
}