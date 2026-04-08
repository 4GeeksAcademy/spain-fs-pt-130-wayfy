import react from 'react';

export const Register = () => {
    return(
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    {/*Tarjeta principal*/}
                    <div className="card border-0 shadow rounded-4 p-4 bg-light">
                        {/*Encabezado del formulario*/}
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary">Crea tu cuenta</h2>
                            <p className="text-muted">Ingresa tus datos para registrarte</p>
                        </div>
                        <form>
                            {/*Nombre*/}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="form-control p-2"
                                    placeholder="Nombre"
                                />
                            </div>
                            {/*Email*/}
                               <div className="mb-3">
                                <label className="form-label fw-semibold">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control p-2"
                                    placeholder="nombre@ejemplo.com"
                                />
                            </div>
                            {/*Contraseñas*/}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control p-2"
                                            placeholder="*************"
                                        />
                                    </div>
                                     <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control p-2"
                                            placeholder="*************"
                                        />
                                    </div>
                                </div>
                                {/*Boton*/}
                                <button type="button" className="btn btn-primary w-100 fw-bold py-2 mt-3">
                                    Registrarme
                                </button>
                                {/*Footer del formulario*/}
                                <div className="text-center mt-4">
                                <span className="text-muted small">¿Ya tienes una cuenta?</span>
                                <a href="/login" className="text-primary fw-bold text-decoration-none small">
                                    Inicia sesión aquí
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}