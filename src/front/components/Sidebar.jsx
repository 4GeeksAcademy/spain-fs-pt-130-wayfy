export const Sidebar = ({ show, toggle, places }) => {
    return (
        <section
            className="bg-white border-start shadow-sm d-flex flex-column position-relative z-1"
            style={{
                width: show ? '400px' : '0',
                transition: 'width 0.3s ease-in-out',
            }}
        >
            <button
                className="btn btn-sm btn-primary rounded-start-pill position-absolute shadow-sm d-flex align-items-center justify-content-center top-50 translate-middle-y"
                style={{ left: '-25px' }}
                onClick={toggle}
            >
                {show ? '❯' : '❮'}
            </button>

            <div
                className="h-100 d-flex flex-column"
                style={{
                    width: '400px',
                    visibility: show ? 'visible' : 'hidden',
                }}
            >
                <div className="p-3 border-bottom bg-light">
                    <h5 className="m-0 text-primary">Información</h5>
                </div>
                <div className="flex-grow-1 overflow-auto p-3">
                    <h6>Marcadores</h6>
                    <hr />
                    {places.map((place) => (
                        <div key={place.id} className="card mb-2 p-2 shadow-sm">
                            {place.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
