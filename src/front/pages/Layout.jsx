import ScrollToTop from '../components/ScrollToTop';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MainComponent } from '../components/MainComponent';
import { ToastContainer } from 'react-toastify';
import { useGlobalHotkeys } from '../hooks/useGlobalHotkeys';

export const Layout = () => {
    useGlobalHotkeys()
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <MainComponent />
                <Footer />
                <ToastContainer />
            </div>
        </ScrollToTop>
    );
};
