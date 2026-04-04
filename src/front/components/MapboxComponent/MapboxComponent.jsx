import { useRef, useEffect, useState } from 'react'
import useGlobalReducer from '../../hooks/useGlobalReducer'
import Map, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxComponent.css'
import urlMarcador from '../../assets/img/marcador.png'

export const MapboxComponent = () => {
    const { store, dispatch } = useGlobalReducer()
    const { viewState, places } = store
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

        console.log(`Coordenadas:\n longitud: ${lng} \n latitud: ${lat}`)
    }

    return (
        <div className='w-100 h-100 position-relative'>
            <Map
                ref={mapRef}
                {...viewState}
                onMove={handeleMove}
                onClick={handeleClickMap}
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
