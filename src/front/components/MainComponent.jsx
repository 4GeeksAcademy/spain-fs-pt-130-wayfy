import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MainComponent = () => {
    const { store } = useGlobalReducer()
    const { places } = store
    const [mostrarSidebar, setMostrarSidebar] = useState(false);
    const handleToggleSidebar = () => setMostrarSidebar(!mostrarSidebar);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 300);

        return () => clearTimeout(timer);
    }, [mostrarSidebar]);

    return (
        <main className="d-flex flex-row flex-grow-1 overflow-hidden position-relative">
            <section
                className="h-100 flex-grow-1 position-relative z-1 overflow-hidden"
            >
                <Outlet />
            </section>

            <aside
                className="bg-white border-start shadow-sm d-flex flex-column position-relative z-1"
                style={{ width: mostrarSidebar ? '400px' : '0', transition: 'width 0.3s ease-in-out' }}
            >
                <button
                    className="btn btn-sm btn-primary rounded-start-pill position-absolute shadow-sm d-flex align-items-center justify-content-center top-50 translate-middle-y"
                    style={{ left: '-25px' }}
                    onClick={handleToggleSidebar}
                >
                    {mostrarSidebar
                        ? '❯'
                        : '❮'
                    }
                </button>

                <div
                    className="h-100 d-flex flex-column"
                    style={{ width: '400px', visibility: mostrarSidebar ? 'visible' : 'hidden' }}
                >
                    <div className="p-3 border-bottom bg-light">
                        <h5 className="m-0 text-primary">Información</h5>
                    </div>
                    <div className="flex-grow-1 overflow-auto p-3">
                        <h6>Resultados</h6>
                        <hr />
                        {places.map((place) => (
                            <div key={place.id} className="card mb-2 p-2 shadow-sm">
                                {place.name}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

        </main>
    )
}
