import useGlobalReducer from '../hooks/useGlobalReducer';
import { AccessibilityDetails } from './AccessibilityMap/AccessibilityDetails';
import { FilterPanel } from './FilterPanel/FilterPanel';
import { SearchMap } from './AccessibilityMap/SearchMap';

export const Sidebar = ({ show, toggle }) => {
    const { store, dispatch } = useGlobalReducer();
    const { places, activeFilters, selectedFeature } = store;

    const handleFilterChange = (newFilters) => {
        dispatch({
            type: 'SET_FILTERS',
            payload: newFilters,
        });
    };

    const handleCloseDetails = () => {
        dispatch({
            type: 'SET_SELECTED_FEATURE',
            payload: null,
        });
    };

    const handleClickDelete = (placeId) => {
        dispatch({
            type: 'REMOVE_PLACE',
            payload: placeId,
        });
    };

    return (
        <section
            className={`sidebar ${show ? 'sidebar-show' : 'sidebar-hidden'} bg-white border-start shadow-sm d-flex flex-column position-relative z-1`}
        >
            <button
                className="btn btn-sm btn-primary rounded-start-pill position-absolute shadow-sm d-flex align-items-center justify-content-center sidebar-btn-left"
                onClick={toggle}
            >
                {show ? '❯' : '❮'}
            </button>

            <div
                className={`sidebar-content ${show ? 'sidebar-content-show' : 'sidebar-content-hidden'} d-flex flex-column overflow-hidden`}
            >
                <SearchMap />
                <div className="flex-grow-1 overflow-auto px-3">
                    {selectedFeature && (
                        <>
                            <AccessibilityDetails
                                feature={selectedFeature}
                                onClose={handleCloseDetails}
                            />
                            <hr />
                        </>
                    )}

                    <FilterPanel
                        active={activeFilters}
                        onChange={handleFilterChange}
                    />

                    {places.length > 0 && (
                        <>
                            <h6>Marcadores</h6>
                            {places.map((place) => (
                                <div
                                    key={place.id}
                                    className="card mb-2 p-2 shadow-sm"
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{place.name}</span>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                handleClickDelete(place.id)
                                            }
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};
