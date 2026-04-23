import { Link } from 'react-router-dom';
import { HOTKEYS } from '../hotkeys/config'
import useGlobalReducer from '../hooks/useGlobalReducer';

export const LoginDropdown = () => {
    const { store } = useGlobalReducer()
    const { showShortcut } = store
    const { GO_USER, GO_LOGIN, GO_REGISTER } = HOTKEYS

    return (
        <div className="dropdown">
            <button
                id='btnLoginDropdown'
                type="button"
                className="btn btn-outline-primary btn-circle border-2 rounded-circle d-inline-flex align-items-center justify-content-center p-2 lh-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-display="static"
            >
                <i className="fa-solid fa-user"></i>
            </button>

            {showShortcut && (
                <span className="badge badge-shortcut bg-dark">
                    {GO_USER.combo}
                </span>
            )}

            <div className="dropdown-menu dropdown-menu-end p-3 settings-dropdown mt-2 shadow" style={{ width: '250px' }}>
                <div className="d-flex gap-2">
                    <div className='position-relative w-100'>
                        <Link to="/login" className="btn btn-outline-primary w-100">
                            Acceder
                        </Link>

                        {showShortcut && (
                            <span className="badge badge-shortcut bg-dark">
                                {GO_LOGIN.combo}
                            </span>
                        )}
                    </div>
                    <div className="position-relative w-100">
                        <Link to="/register" className="btn btn-success w-100">
                            Registro
                        </Link>
                        {showShortcut && (
                            <span className="badge badge-shortcut bg-dark">
                                {GO_REGISTER.combo}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
