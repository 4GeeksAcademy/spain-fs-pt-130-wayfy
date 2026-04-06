import { useRef, useEffect, useState } from 'react' // Añadimos useState
import useGlobalReducer from '../../hooks/useGlobalReducer'
import Map, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxComponent.css'

export const MapboxComponent = () => {
    const { store, dispatch } = useGlobalReducer()
    const { viewState, places, selectedLocation } = store
    const [loading, setLoading] = useState(true)
    const mapRef = useRef(null)


    const updateLocation = (newViewState) => {
        dispatch({
            type: 'UPDATE_LOCATION',
            payload: newViewState
        })
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(posicion => {
                const { longitude, latitude } = posicion.coords;
                updateLocation({
                    ...viewState,
                    longitude,
                    latitude,
                    zoom: 14
                })
                setLoading(false)
            },
                error => {
                    console.error('Error ubicación:', error)
                    setLoading(false)
                },
                { enableHighAccuracy: true }
            )
        } else {
            setLoading(false)
        }
    }, [])

    const handleMove = (evt) => {
        updateLocation(evt.viewState)
    }

    const handleClickMap = (e) => {
        const { lng, lat } = e.lngLat;
        console.log(`Lat: ${lat}, Lng: ${lng}`)
    }

    return (
        <div className='w-100 h-100 position-relative'>
            {loading && (
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white"
                    style={{ zIndex: 99 }}
                >
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="fw-bold text-secondary">Cargando ubicación actual...</p>
                </div>
            )}

            <Map
                ref={mapRef}
                longitude={viewState.longitude}
                latitude={viewState.latitude}
                zoom={viewState.zoom}
                onMove={handleMove}
                onClick={handleClickMap}
                className='mapa'
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            >
                <GeolocateControl
                    position="top-right"
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                    showUserLocation={true}
                    onGeolocate={e => updateLocation(e.viewState)}
                />

                {selectedLocation && (
                    <Marker
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        anchor='bottom'
                        color='red'
                    />
                )}

                {places && places.map(place => (
                    <Marker
                        longitude={place.longitude}
                        latitude={place.latitude}
                        anchor='bottom'
                        key={place.id}
                    >
                        <div
                            className='marcador'
                            onClick={() => console.log('Clic en:', place.name)}
                        >
                        </div>
                    </Marker>
                ))}
            </Map>
        </div>
    );
}