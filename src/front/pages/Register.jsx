import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const Register = () => {
  // Obtenemos la función login de nuestro contexto global
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);
  const [selectedMobility, setSelectedMobility] = useState([]);
  const [token, setToken] = useState(null);

  const mobilityOptions = [
    { id: 'silla', label: 'Usuario de silla de ruedas', icon: 'fa-solid fa-wheelchair-move' },
    { id: 'andador', label: 'Uso de andador/bastón', icon: 'fa-solid fa-person-walking-with-cane' },
    { id: 'movilidad', label: 'Movilidad reducida', icon: 'fa-solid fa-person-walking' },
    { id: 'mayor', label: 'Adulto mayor', icon: '👴' },
    { id: 'sin', label: 'Sin limitaciones', icon: 'fa-solid fa-check' },
  ];

  const toggleMobility = (id) => {
    if (selectedMobility.includes(id)) {
      setSelectedMobility(selectedMobility.filter(item => item !== id));
    } else {
      setSelectedMobility([...selectedMobility, id]);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "full_name": fullName,
          "email": email,
          "password": password,
          "mobility_phase": selectedMobility.join(",")
        })
      });

      if (response.ok) {
        const data = await response.json();

        login({
          token: data.token,
          full_name: data.full_name,
        });

        alert("¡Registro exitoso! Bienvenido.");

        navigate("/");
      } else {
        const data = await response.json();
        alert("Error: " + data.msg);
      }

    } catch (error) {
      console.error("Error en el registro", error);
      alert("Error de conexión. Asegúrate de que el puerto 3001 sea PÚBLICO.");
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
                {step === 1 ? "Paso 1: Datos de acceso" : "Paso 2: ¿Cómo te trasladas? (Puedes elegir varios)"}
              </p>
            </div>

            <form>
              {step === 1 ? (
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
                      <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Confirmar</label>
                      <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="******" />
                    </div>
                  </div>
                  <button type="button" className="btn btn-success w-100 fw-bold py-2 mt-2" onClick={() => setStep(2)}>
                    Elegir Perfil <i className="fa-solid fa-circle-arrow-right ms-2"></i>
                  </button>
                </>
              ) : (
                <>
                  <div className="row g-2 mb-4">
                    {mobilityOptions.map((opt) => {
                      const isSelected = selectedMobility.includes(opt.id);
                      return (
                        <div key={opt.id} className="col-4">
                          <div
                            onClick={() => toggleMobility(opt.id)}
                            className={`p-3 border rounded-4 text-center shadow-sm h-100 d-flex flex-column align-items-center justify-content-center transition-all ${isSelected
                              ? 'bg-success border-success text-white'
                              : 'bg-white border-light-subtle text-secondary'
                              }`}
                            style={{ cursor: 'pointer', transition: '0.4s' }}
                          >
                            <span className={`fs-2 mb-1 ${isSelected ? 'text-white' : 'text-secondary'}`}>
                              {opt.icon.includes("fa-") ? <i className={opt.icon}></i> : opt.icon}
                            </span>

                            <span className="fw-bold mt-1" style={{ fontSize: '0.7rem' }}>{opt.label}</span>
                          </div>
                        </div>
                      );
                    })}
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