import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"


export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="container-fluid flex-grow-1 d-flex flex-column">
                    <div className="row flex-grow-1">
                        <section className="col-12 col-md-9 px-4 p-y3">
                            <Outlet />
                        </section>
                        <aside className="col-12 col-md-3 bg-light border-start shadow-sm">
                            <div className="p-3 sticky-top">
                                <h5 className="text-primary">Panel Lateral</h5>
                                <hr />
                                <p>Información adicional aquí</p>
                            </div>
                        </aside>
                    </div>
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    )
}