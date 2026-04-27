import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

export const Login = () => {
    // Decidí agrupar los campos en un solo objeto 'inputs', tal como hice en el register.
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    // Esta función centraliza el cambio de todos los inputs.
    // La hice así porque reduce la cantidad de código y hace que el mantenimiento sea más simple.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            // Usar la variable de entorno es mejor porque así mi código es más seguro y flexible.
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs)
            });

            const data = await response.json();

            if (!response.ok) {
                // Cambié el alert por toast porque me parece que interrumpe menos la navegación
                // y se ve mucho más profesional en la interfaz.
                toast.error(data.msg || "Error al iniciar sesión");
                return;
            }

            // Aquí guardo la sesión si todo salió bien
            login({
                token: data.token,
                full_name: data.user.full_name
            });

            toast.success("Bienvenido de nuevo");
            navigate("/Itinerary");
        }
        catch (error) {
            console.error("Error al iniciar sesión:", error);
            toast.error("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-3 h-80">
            <form className="p-4 border rounded bg-light" style={{ width: "300px" }} onSubmit={handleLogin}>

                <div className="fw-bold text-primary mb-3">
                    Iniciar Sesión
                </div>

                <div className="mb-3 fw-bold">
                    <label className="form-label">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="form-control"
                        value={inputs.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3 fw-bold">
                    <label className="form-label">Contraseña</label>
                    <input
                        name="password"
                        type="password"
                        className="form-control"
                        value={inputs.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Iniciar Sesión
                </button>

                <div className="text-center m-3">
                    <p>
                        ¿No tienes cuenta?{" "}
                        {/* Cambie el <a> por <Link> de react-router-dom. 
                            Lo hice porque así la navegación no recarga toda la página y la app se siente más fluida. */}
                        <Link to="/register" className="text-primary text-decoration-none">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};