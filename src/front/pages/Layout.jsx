import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { MainComponent } from "../components/MainComponent"
import { ToastContainer } from "react-toastify"


export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex flex-column vh-100 overflow-hidden">
                <Navbar />
                <MainComponent />
                <Footer />
                <ToastContainer />
            </div>
        </ScrollToTop>
    )
}