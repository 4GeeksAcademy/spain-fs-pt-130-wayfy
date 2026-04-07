export const Login = () => {

    return (

        <div className="container d-flex justify-content-center mt-3">
            <form className="p-4 border rounded bg-light" style={{ width: "400px" }}>

                <h5 className="fw-bold text-primary mb-3">
                    Iniciar Sesión
                </h5>

                
                <div className="form-group fw-bold">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" aria-describedby="emailHelp" />
                    <div id="Email" className="form-text"></div>
                </div>

              
                <div className="form-group fw-bold">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" />
                </div>

                <div className="form-check mb-3 m-2">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                        Recordar mi Contraseña
                    </label>
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Iniciar Sesión
                </button>

                <div className="Registro text-center m-3">
                    <p>
                        ¿No tienes cuenta?{" "}
                        <a href="/register" className="text-primary text-decoration-none">
                            Regístrate
                        </a>
                    </p>
                </div>
            </form>
        </div>



    )

}