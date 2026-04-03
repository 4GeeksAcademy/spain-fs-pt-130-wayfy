import { useState } from "react"


export const LoginDropdown = () => {
    const [mostrarLogin, setMostrarLogin] = useState(false)

    return (
        <div className="dropdown">
            <button
                type="button"
                className="btn btn-lg btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center p-2 lh-1"
                onClick={() => setMostrarLogin(!mostrarLogin)}
            >
                <i className="fa-solid fa-user"></i>
            </button>

            <div
                className={`dropdown-menu dropdown-menu-end shadow border-0 m-0 position-absolute end-0 mt-2 ${mostrarLogin ? 'show' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="login-dropdown-width p-4">
                    {/* <LoginComponent titulo="" /> */}
                </div>
            </div>
        </div>
    )
}
