import { useRef, useEffect, useState } from 'react'
import useGlobalReducer from '../../hooks/useGlobalReducer'
import Map, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapboxComponent = () => {
    const { store, dispatch } = useGlobalReducer()
    const { viewState, places } = store
    const [marcadorTemporal, setMarcadorTemporal] = useState(null)
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
                    latitude
                })
            },
                error => {
                    console.error('Error obteniendo ubicación inicial:', error)
                },
                { enableHighAccuracy: true }
            )
        }
    }, [])


    const handeleMove = (evt => {
        updateLocation(evt.viewState)
    })

    const handeleClickMap = (e) => {
        const { lng, lat } = e.lngLat;

        setMarcadorTemporal({ longitude: lng, latitude: lat })
    }

    return (
        <div className='w-100 h-100 position-relative'>
            <Map
                ref={mapRef}
                {...viewState}
                onMove={handeleMove}
                onClick={handeleClickMap}
                style={{ width: '100%', height: '100%' }}
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
                {places && places.map(place => (
                    <Marker
                        longitude={place.longitude}
                        latitude={place.latitude}
                        anchor='bottom'
                        key={place.id}
                    >
                        <div style={{ cursor: 'pointer', fontSize: '25px' }} onClick={() => console.log('Clic en:', place.name)}>♿</div>
                    </Marker>
                ))}

                {marcadorTemporal && (
                    <Marker
                        longitude={marcadorTemporal.longitude}
                        latitude={marcadorTemporal.latitude}
                        anchor='bottom'
                    >
                        <div style={{ cursor: 'pointer', fontSize: '25px', color: 'red' }}>♿</div>
                    </Marker>
                )}
            </Map>
        </div>
    );
}
