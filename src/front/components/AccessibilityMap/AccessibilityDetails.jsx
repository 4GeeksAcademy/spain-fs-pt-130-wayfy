import { Link } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useGlobalReducer';

const WHEELCHAIR_LABELS = {
    yes: {
        label: 'Totalmente accesible',
        color: 'success',
        icon: 'fa-wheelchair',
    }, // success
    limited: {
        label: 'Parcialmente accesible',
        color: 'warning',
        icon: 'fa-triangle-exclamation',
    }, // warning
    no: {
        label: 'No accesible',
        color: 'danger',
        icon: 'fa-ban',
    }, // danger
    designated: {
        label: 'Estado desconocido',
        color: 'secondary',
        icon: 'fa-circle-question',
    },
};

export const AccessibilityDetails = ({ feature, onClose }) => {
    const { store, dispatch } = useGlobalReducer();
    const { places, favorites } = store;

    if (!feature) return null;

    const p = feature.properties;
    const isAlreadySaved = places?.some((place) => place.id === p.id);
    const isFavorite = favorites?.some((favorite) => favorite.id === p.id)
    const coords = feature.geometry?.coordinates;

    const wheelchair = WHEELCHAIR_LABELS[p.wheelchair];

    const osmUrl = `https://www.openstreetmap.org/${p.osm_type || 'node'}/${p.id}`;

    const handleTogglePlace = () => {
        if (isAlreadySaved) {
            dispatch({
                type: 'REMOVE_PLACE',
                payload: p.id,
            });
        } else {
            const newPlace = {
                id: p.id || Date.now(),
                name: p.name || 'Lugar sin nombre',
                longitude: coords ? coords[0] : null,
                latitude: coords ? coords[1] : null,
            };

            dispatch({
                type: 'ADD_PLACE',
                payload: newPlace,
            });

            // if (onClose) onClose();
        }
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            dispatch({
                type: 'REMOVE_FAVORITE',
                payload: p.id,
            });
        } else {
            const newFavorite = {
                id: p.id || Date.now(),
                name: p.name || 'Lugar sin nombre',
                longitude: coords ? coords[0] : null,
                latitude: coords ? coords[1] : null,
            };

            dispatch({
                type: 'ADD_FAVORITE',
                payload: newFavorite
            });
        }
    };

    return (
        <>
            {/* CABECERA */}
            <div className="card bg-light p-3 mb-3 position-relative">
                <button
                    className="btn btn d-flex ms-auto p-0 bg-transparent text-secondary position-absolute end-0 top-0 mt-2 me-2"
                    onClick={onClose}
                >
                    <i className="fa-solid fa-circle-xmark fs-5"></i>
                </button>

                <div className="d-flex align-items-center gap-3">
                    <div
                        className={`bg-${wheelchair.color} rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white flex-shrink-0`}
                        style={{
                            width: '50px',
                            height: '50px',
                            fontSize: '1.2rem',
                        }}
                    >
                        <i className={`fa-solid ${wheelchair.icon}`}></i>
                    </div>
                    <div>
                        <h5 className="fw-bold m-0 text-dark lh-sm">
                            {p.name || 'Lugar sin nombre'}
                        </h5>
                        <div
                            className="small fw-semibold"
                            style={{ color: wheelchair.color }}
                        >
                            {wheelchair.label}
                        </div>
                    </div>
                </div>

                <div className='d-flex align-items-center gap-2 mt-3'>
                    <button
                        type="button"
                        className={`btn ${isAlreadySaved ? 'btn-outline-danger' : 'btn-success'} fw-bold shadow-sm w-100`}
                        onClick={handleTogglePlace}
                    >
                        {isAlreadySaved ? (
                            <>
                                <i className="fa-solid fa-trash-can me-2"></i>
                                Eliminar de mi lista
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-plus me-2"></i>
                                Agregar a mi lista
                            </>
                        )}
                    </button>
                    <button
                        className='btn btn-link'
                        onClick={handleToggleFavorite}
                    >
                        <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-danger fs-4 align-self-center`}></i>
                    </button>
                </div>
            </div>

            <div className="border-top py-2">
                <div className="d-flex justify-content-between align-items-center opacity-50">
                    <span className='text-small text-muted'>OSM ID: {p.id}</span>
                    <a
                        href={osmUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-dark text-small text-decoration-none fw-bold"
                    >
                        Ver en OpenStreetMap{' '}
                        <i
                            className="fa-solid fa-arrow-up-right-from-square ms-1"
                        ></i>
                    </a>
                </div>
            </div>
        </>
    );
};
