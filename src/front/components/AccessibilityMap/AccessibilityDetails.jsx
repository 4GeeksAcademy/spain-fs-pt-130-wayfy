import { Link } from 'react-router-dom';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { translateTag, translateValue, translateCategory, getCategoryIcon } from '../../utils/translations/OSM_TRANSLATIONS';
import { useTheme } from '../../context/ThemeContext'

const WHEELCHAIR_LABELS = {
    yes: {
        label: 'Totalmente accesible',
        color: 'success',
        icon: 'fa-wheelchair',
    },
    limited: {
        label: 'Parcialmente accesible',
        color: 'warning',
        icon: 'fa-triangle-exclamation',
    },
    no: {
        label: 'No accesible',
        color: 'danger',
        icon: 'fa-ban',
    },
    unknown: {
        label: 'Estado desconocido',
        color: 'secondary',
        icon: 'fa-circle-question',
    },
};

const formatAddress = (tags) => {
    const street = tags['addr:street'];
    const number = tags['addr:housenumber'];
    const postcode = tags['addr:postcode'];
    const city = tags['addr:city'];

    if (!street && !city) return null;

    return `${street || ''} ${number || ''}, ${postcode || ''} ${city || ''}`.trim();
}


export const AccessibilityDetails = ({ feature, onClose }) => {
    const { store, dispatch } = useGlobalReducer();
    const { places } = store;
    const { theme } = useTheme()

    if (!feature) return null;

    const properties = feature.properties;
    const category = translateCategory(properties.sub_type)
    const categoryIcon = getCategoryIcon(properties.sub_type)

    const tags =
        typeof properties.all_tags === 'string'
            ? JSON.parse(properties.all_tags)
            : properties.all_tags || {};

    const coords = feature.geometry?.coordinates;

    const isAlreadySaved = places?.some((place) => place.id === properties.id);
    // const isFavorite = favorites?.some((fav) => fav.id === properties.id);

    const wheelchair = WHEELCHAIR_LABELS[properties.wheelchair] || WHEELCHAIR_LABELS.unknown;

    const osmUrl = `https://www.openstreetmap.org/${properties.osm_type || 'node'}/${properties.id}`;

    const handleTogglePlace = () => {
        if (isAlreadySaved) {
            dispatch({ type: 'REMOVE_PLACE', payload: properties.id });
        } else {
            dispatch({
                type: 'ADD_PLACE',
                payload: {
                    id: properties.id,
                    name: properties.name || 'Lugar sin nombre',
                    longitude: coords?.[0],
                    latitude: coords?.[1],
                },
            });
        }
    };

    // const handleToggleFavorite = () => {
    //     if (isFavorite) {
    //         dispatch({ type: 'REMOVE_FAVORITE', payload: properties.id });
    //     } else {
    //         dispatch({
    //             type: 'ADD_FAVORITE',
    //             payload: {
    //                 id: properties.id,
    //                 name: properties.name || 'Lugar sin nombre',
    //                 longitude: coords?.[0],
    //                 latitude: coords?.[1],
    //             },
    //         });
    //     }
    // };

    const nonEmpty = (value) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'unknown';

    const AutoFields = ({ data }) =>
        Object.entries(data)
            .filter(([_, value]) => nonEmpty(value))
            .map(([key, value]) => {
                const label = translateTag(key)
                const translatedValue = translateValue(key, value)

                return (
                    <div className="small mb-2" key={key}>
                        <strong>{label}:</strong> {String(translatedValue)}
                    </div>
                )
            });

    const accessibilityTags = {
        "wheelchair:description": tags["wheelchair:description"],
        "wheelchair:access": tags["wheelchair:access"],
        "entrance:wheelchair": tags["entrance:wheelchair"],
        "door:width": tags["door:width"],
        "door:automatic": tags["door:automatic"],
        "door:bell": tags["door:bell"],
        "kerb": tags["kerb"],
        "incline": tags["incline"],
        "tactile_paving": tags["tactile_paving"],
        "toilets:wheelchair": tags["toilets:wheelchair"],
        "wheelchair:boarding": tags["wheelchair:boarding"],
        "step_free": tags["step_free"],
        "lift": tags["lift"],
        "escalator": tags["escalator"],
    };

    const infoTags = {
        address: formatAddress(tags),
        opening_hours: tags["opening_hours"],
        phone: tags["phone"],
        email: tags["email"],
        website: tags["website"]
    };

    const Section = ({ title, icon, children }) => (
        <>
            <h6>
                <i className={`fa-solid ${icon} me-2`}></i>
                {title}
            </h6>
            {children}
        </>
    );

    return (
        <>
            {/* CABECERA */}
            <div className="card p-3 mb-3 position-relative">
                <button
                    className="btn btn d-flex ms-auto p-0 text-secondary position-absolute end-0 top-0 mt-2 me-2"
                    onClick={onClose}
                >
                    <i className="fa-solid fa-circle-xmark fs-5"></i>
                </button>

                <div className="d-flex flex-column gap-3">
                    <div
                        className={`bg-${wheelchair.color} rounded-circle shadow-sm d-flex align-items-center justify-content-center text-white`}
                        style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}
                    >
                        <i className={`fa-solid ${wheelchair.icon}`}></i>
                    </div>

                    <div>
                        <h5 className="fw-bold m-0 lh-sm">{properties.name || 'Lugar sin nombre'}</h5>
                        <div className="small fw-semibold text-capitalize" style={{ color: `var(--bs-${wheelchair.color})` }}>
                            {wheelchair.label}
                        </div>

                        <div className="small text-muted">
                            <i className={`fa-solid ${categoryIcon} me-2`}></i>
                            {category}
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2 mt-3">
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

                    {/* <button className="btn btn-link" onClick={handleToggleFavorite}>
                        <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-danger fs-4`}></i>
                    </button> */}
                </div>

                {Object.values(accessibilityTags).some(nonEmpty) && (
                    <div className={`bg-success rounded-3 ${theme === 'light' ? 'text-white' : 'text-dark'} p-2 mt-2`}>
                        <Section title="Accesibilidad" icon="fa-wheelchair">
                            <AutoFields data={accessibilityTags} />
                        </Section>
                    </div>
                )}

                {(infoTags.address || infoTags.opening_hours || infoTags.phone || infoTags.email || infoTags.website) && (

                    <div className="bg-info rounded-3 text-dark p-2 mt-2">
                        <Section title="Información" icon="fa-circle-info">
                            {infoTags.address && (
                                <div className="small">
                                    <strong>Dirección:</strong> {infoTags.address}
                                </div>
                            )}
                            {infoTags.opening_hours && (
                                <div className="small">
                                    <strong>Horario:</strong> {translateValue('opening_hours', infoTags.opening_hours)}
                                </div>
                            )}
                            {infoTags.phone && (
                                <div className="small">
                                    <strong>Teléfono:</strong> {translateValue('phone', infoTags.phone)}
                                </div>
                            )}
                            {infoTags.email && (
                                <div className="small">
                                    <strong>Email:</strong> {translateValue('email', infoTags.email)}
                                </div>
                            )}
                            {infoTags.website && (
                                <div className="small">
                                    <strong>Web: </strong>
                                    <a
                                        href={infoTags.website.startsWith('http') ? infoTags.website : `https://${infoTags.website}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='fw-semibold text-decoration-none'
                                    >
                                        {translateValue('website', infoTags.website)}
                                        <i className="fa-solid fa-arrow fa-arrow-up-right-from-square ms-2"></i>
                                    </a>
                                </div>
                            )}
                        </Section>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="border-top py-2">
                <div className="d-flex justify-content-between align-items-center opacity-50">
                    <span className="text-small text-muted">OSM ID: {properties.id}</span>
                    <a
                        href={osmUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-small text-decoration-none fw-bold"
                    >
                        Ver en OpenStreetMap{' '}
                        <i className="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                    </a>
                </div>
            </div>
        </>
    );
};
