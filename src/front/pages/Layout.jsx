import ScrollToTop from '../components/ScrollToTop';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MainComponent } from '../components/MainComponent';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../components/context/AuthProvider';

export const Layout = () => {
    return (
        <AuthProvider>
            <ScrollToTop>
                <div className="d-flex flex-column min-vh-100">
                    <Navbar />
                    <MainComponent />
                    <Footer />
                    <ToastContainer />
                </div>
            </ScrollToTop>
        </AuthProvider>
    );
};
