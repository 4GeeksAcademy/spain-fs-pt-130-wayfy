import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Register = () => {
    // 1. Estados para los datos del usuario
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    // 2. Estados para controlar el flujo del formulario (pasos y selección)
    const [step, setStep] = useState(1);
    const [selectedMobility, setSelectedMobility] = useState(null);

    // Opciones del perfil de movilidad
    const mobilityOptions = [
        { id: 'silla', label: 'Usuario de silla de ruedas', icon: '♿' },
        { id: 'andador', label: 'Uso de andador/bastón', icon: '🦯' },
        { id: 'movilidad', label: 'Movilidad reducida', icon: '🚶' },
        { id: 'mayor', label: 'Adulto mayor', icon: '👴' },
        { id: 'sin', label: 'Sin limitaciones', icon: '✓' },
    ];

    // Función que conecta con el backend
    const handleRegister = async () => {
        // Validación básica: Contraseñas iguales
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        // Llamada a la API (Endpoint que se creo en routes.py)
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "full_name": fullName,
                    "email": email,
                    "password": password,
                    "mobility_phase": selectedMobility
                })
            });

            if (response.ok) {
                alert("¡Registro exitoso! Ya puedes iniciar sesión.");
            } else {
                const data = await response.json();
                alert("Error: " + data.msg);
            }
        } catch (error) {
            console.error("Error en el registro", error);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card border-0 shadow rounded-4 p-4 bg-light">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary">
                                {step === 1 ? "Crea tu cuenta" : "Perfil de Movilidad"}
                            </h2>
                            <p className="text-muted small">
                                {step === 1 ? "Paso 1: Datos de acceso" : "Paso 2: ¿Cómo te trasladas?"}
                            </p>
                        </div>

                        <form>
                            {step === 1 ? (
                                /* PASO 1: DATOS BÁSICOS */
                                <>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre Completo</label>
                                        <input type="text" className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ej. Juan Pérez" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Correo Electrónico</label>
                                        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@ejemplo.com" />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Contraseña</label>
                                            <input type="password" d className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Confirmar</label>
                                            <input type="password" d className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="******" />
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary w-100 fw-bold py-2 mt-2" onClick={() => setStep(2)}>
                                        Siguiente: Elegir Perfil
                                    </button>
                                </>
                            ) : (
                                /* PASO 2: SELECCIÓN DE MOVILIDAD */
                                <>
                                    <div className="row g-2 mb-4">
                                        {mobilityOptions.map((opt) => (
                                            <div key={opt.id} className="col-4">
                                                <div 
                                                    className={`p-3 border rounded-4 text-center shadow-sm h-100 d-flex flex-column align-items-center justify-content-center transition-all ${selectedMobility === opt.id ? 'bg-primary text-white border-primary' : 'bg-white text-dark'}`}
                                                    onClick={() => setSelectedMobility(opt.id)}
                                                    style={{ cursor: 'pointer', transition: '0.3s' }}
                                                >
                                                    <span className="fs-2 mb-1">{opt.icon}</span>
                                                    <span className="fw-bold" style={{ fontSize: '0.7rem' }}>{opt.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="button" className="btn btn-outline-secondary w-50 fw-bold" onClick={() => setStep(1)}>Atrás</button>
                                        <button type="button" className="btn btn-success w-50 fw-bold shadow-sm" onClick={handleRegister}>Finalizar</button>
                                    </div>
                                </>
                            )}

                            <div className="text-center mt-4 border-top pt-3">
                                <span className="text-muted small">¿Ya tienes una cuenta?</span>
                                <Link to="/login" className="ms-2 text-primary fw-bold text-decoration-none small">Inicia sesión</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};