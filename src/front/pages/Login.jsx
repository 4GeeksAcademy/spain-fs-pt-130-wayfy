import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

export const Login = () => {
    const { login } = useContext(UserContext)
    const [inputs, setInputs] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleSumit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputs)
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.msg, { position: 'top-center' })
                return;
            }

            login({
                token: data.token,
                full_name: data.user.full_name
            })

            toast.success('Inicio de sesión exitoso', { position: 'top-center' })
            navigate('/itinerary')

        } catch (error) {
            console.error("Error en login:", error)
            toast.error('Error de conexión:', { position: 'top-center' })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setInputs({
            ...inputs,
            [name]: value
        })
    }

    return (
        <div className="container d-flex justify-content-center my-5 h-50">
            <div className="card col-12 col-md-6 col-lg-5 p-4">
                <h2 className="fw-bold text-primary m-0">Iniciar sesión</h2>

                <form onSubmit={handleSumit} className='d-flex flex-column gap-1 mt-4'>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Correo Electrónico</label>
                        <input name='email' type="email" className="form-control" value={inputs.email} onChange={handleChange} placeholder="nombre@ejemplo.com" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <input name='password' type="password" className="form-control" value={inputs.password} onChange={handleChange} placeholder="******" />
                    </div>
                    <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm">Iniciar sesión</button>
                    <div className="text-center mt-4 border-top pt-3">
                        <span className="text-muted small">¿No tienes cuenta?</span>
                        <Link to="/register" className="ms-2 text-primary fw-bold text-decoration-none small">Regístrate</Link>
                    </div>

                </form>
            </div>
        </div>
    );
};