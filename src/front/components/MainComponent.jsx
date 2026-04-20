import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { Sidebar } from './Sidebar';

export const MainComponent = () => {
    const { store } = useGlobalReducer();
    const { places } = store;
    const [showSidebar, setShowSidebar] = useState(true);
    const location = useLocation();

    const handleToggleSidebar = () => setShowSidebar(!showSidebar);

    useEffect(() => {
        const interval = setInterval(() => {
            window.dispatchEvent(new Event('resize'));
        }, 10); // Cada 10ms refresca el tamaño del mapa

        const timer = setTimeout(() => {
            clearInterval(interval);
            window.dispatchEvent(new Event('resize'));
        }, 300);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [showSidebar]);

    return (
        <main className="d-flex flex-row flex-grow-1 position-relative overflow-hidden">
            <section className="h-100 flex-grow-1 position-relative z-1 overflow-auto">
                <Outlet />
            </section>

            {location.pathname === '/map' && (
                <Sidebar
                    show={showSidebar}
                    toggle={handleToggleSidebar}
                    places={places}
                />
            )}
        </main>
    );
};
