import ScrollToTop from '../components/ScrollToTop';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ToastContainer } from 'react-toastify';
import { useGlobalHotkeys } from '../hooks/useGlobalHotkeys';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
    useGlobalHotkeys()
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="d-flex flex-row flex-grow-1 position-relative overflow-hidden">
                    <Outlet />
                </main>
                <Footer />
                <ToastContainer />
            </div>
        </ScrollToTop>
    );
};
