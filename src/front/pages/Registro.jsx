export const Registro = () => {

    return (

        <div className="container d-flex justify-content-center mt-3 ">
            <form className="p-4 border rounded bg-light" style={{ width: "400px" }}>

                <h5 className=" mb-3 text-primary fw-bold">
                    Regístrate
                </h5>


                <div className="form-group mb-3 fw-bold">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" placeholder="Ingresa tu nombre" />
                </div>


                <div className="form-group mb-3 fw-bold">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="Ingresa tu email" />
                </div>


                <div className="form-group mb-3 fw-bold">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" placeholder="Crea una contraseña" />
                </div>


                <div className="form-group fw-bold">
                    <label className="form-label">Confirmar contraseña</label>
                    <input type="password" className="form-control" placeholder="Repite la contraseña" />
                </div>

                <button type="submit" className="btn btn-success w-100 mt-3">
                    Registrarme
                </button>

                <div className="Login text-center m-3">
                    <p>
                        ¿Tienes cuenta?{" "}
                        <a href="/login" className="text-primary text-decoration-none">
                            Haz click aquí
                        </a>
                        {" "} para acceder.
                    </p>
                </div>

            </form>
        </div>



    )

}