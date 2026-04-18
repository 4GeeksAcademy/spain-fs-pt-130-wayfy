import { Link } from 'react-router-dom';

export const LoginDropdown = () => {
    return (
        <div className="dropdown">
            <button
                type="button"
                className="btn btn-lg btn-outline-primary btn-circle border-2 rounded-circle d-inline-flex align-items-center justify-content-center p-2 lh-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-display="static"
            >
                <i className="fa-solid fa-user"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end rounded-5 shadow bg-s border-2 m-0 mt-2 p-3">
                <li>
                    <div className="d-flex gap-2">
                        <Link to="/login" className="btn btn-success w-50">
                            Acceder
                        </Link>
                        <Link to="/register" className="btn btn-primary w-50">
                            Registro
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
};
