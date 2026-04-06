import { SearchBox } from '@mapbox/search-js-react';
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Search = () => {
    const { store, dispatch } = useGlobalReducer();
    const { viewState } = store;

    const handleRetrieve = (res) => {
        if (res?.features?.length > 0) {
            const feature = res.features[0];
            const [longitude, latitude] = feature.geometry.coordinates;

            const placeType = feature.properties.feature_type;
            const newZoom = placeType === 'address' ? 18 : 14;

            dispatch({
                type: 'UPDATE_LOCATION',
                payload: {
                    longitude,
                    latitude,
                    zoom: newZoom,
                }
            });

            dispatch({
                type: 'SET_SELECTED_LOCATION',
                payload: { longitude, latitude }
            });
        }
    };

    return (
        <div className="search-wrapper w-100 p-2">
            <SearchBox
                accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                options={{
                    language: 'es',
                    proximity: [viewState.longitude, viewState.latitude]
                }}
                placeholder="¿A dónde quieres viajar?"
                onRetrieve={handleRetrieve}
                theme={{
                    variables: {
                        borderRadius: '50px',
                        border: '2px solid #10b891',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        fontFamily: 'inherit',
                        padding: '10px 20px',
                        unit: 16

                    }
                }}
            />
        </div>
    );
};