import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

export const Register = () => {
  // CORRECCIÓN: Antes tenía cada campo como un useState separado.
  // Lo corregí agrupándolos en un solo objeto 'inputs' como Juanma me explico. 
  // Hice esto porque es más eficiente: si mañana añado un campo, no tengo que crear un estado nuevo, solo añado una propiedad.
  const initialsData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    selectedMobility: []
  }

  const [inputs, setInputs] = useState(initialsData);


  // Implementé este 'step' para dividirlo en dos pantallas. 
  // Lo hice así porque mejora mucho la experiencia de usuario (UX) al no saturar con demasiados campos.
  const [step, setStep] = useState(1);

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const mobilityOptions = [
    { id: 'silla', label: 'Usuario de silla de ruedas', icon: 'fa-wheelchair-move' },
    { id: 'andador', label: 'Uso de andador/bastón', icon: 'fa-person-walking-with-cane' },
    { id: 'movilidad', label: 'Movilidad reducida', icon: 'fa-person-walking' },
    { id: 'mayor', label: 'Adulto mayor', icon: 'fa-user-nurse' },
    { id: 'sin', label: 'Sin limitaciones', icon: 'fa-check' },
  ];


  const toggleMobility = (id) => {
    setInputs(prev => {
      const alreadySelected = prev.selectedMobility.includes(id);
      return {
        ...prev,
        selectedMobility: alreadySelected
          ? prev.selectedMobility.filter(item => item !== id)
          : [...prev.selectedMobility, id]
      };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (inputs.password !== inputs.confirmPassword) {
      // CORRECCIÓN: Antes usaba alert(). 
      // Lo cambié por toast porque no bloquea el navegador y se ve mucho más profesional.
      toast.error("Las contraseñas no coinciden", { position: 'top-center' });
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "full_name": inputs.fullName,
          "email": inputs.email,
          "password": inputs.password,
          "mobility_phase": inputs.selectedMobility.join(",")
        })
      });

      if (response.ok) {
        const data = await response.json();
        login({
          token: data.token,
          full_name: data.user.full_name,
        });
        toast.success("¡Registro exitoso!", { position: 'top-center' });
        navigate("/");
      } else {
        const data = await response.json();
        toast.error("Error: " + data.msg, { position: 'top-center' });
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor", { position: 'top-center' });
    }
  };

  // CORRECCIÓN: Antes tenía una función de cambio manual por input.
  // Ahora uso esta función genérica. Lo hice así porque es el estándar en React para formularios dinámicos.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  return (
    <div className="container d-flex justify-content-center my-5">
      <div className="card col-12 col-md-6 col-lg-5 p-4">
        <h2 className="fw-bold text-primary m-0">
          {step === 1 ? "Crea tu cuenta" : "Perfil de Movilidad"}
        </h2>
        <p className="text-muted small m-0">
          {step === 1 ? "Paso 1: Datos de acceso" : "Paso 2: ¿Cómo te trasladas?"}
        </p>

        <form className='d-flex flex-column gap-1 mt-4'>
          {step === 1 && (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre Completo</label>
                <input name='fullName' type="text" className="form-control" value={inputs.fullName} onChange={handleChange} placeholder="Ej. Juan Pérez" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Correo Electrónico</label>
                <input name='email' type="email" className="form-control" value={inputs.email} onChange={handleChange} placeholder="nombre@ejemplo.com" />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input name='password' type="password" className="form-control" value={inputs.password} onChange={handleChange} placeholder="******" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Confirmar</label>
                  <input name='confirmPassword' type="password" className="form-control" value={inputs.confirmPassword} onChange={handleChange} placeholder="******" />
                </div>
              </div>
              <button type="button" className="btn btn-success w-100 fw-bold py-2 mt-2" onClick={() => setStep(2)}>
                Elegir Perfil <i className="fa-solid fa-circle-arrow-right ms-2"></i>
              </button>
            </>
          )}

          {step === 2 && (
            <div className='row g-2'>
              {mobilityOptions.map((opt) => {
                const isSelected = inputs.selectedMobility.includes(opt.id);
                return (
                  <div className="col-4 d-flex" key={opt.id}>
                    <button
                      type='button'
                      onClick={() => toggleMobility(opt.id)}
                      className={`btn btn-sm w-100 h-100 d-flex flex-column align-items-center py-2 border-2 rounded-2 ${isSelected
                        ? 'btn-success border-success text-primary fw-bold shadow-sm'
                        : 'btn-light border-light-subtle text-muted opacity-50'
                        }`}
                    >
                      <i className={`fa-solid ${opt.icon} ${isSelected ? 'text-white' : 'text-muted'} text-small mb-1`}></i>
                      <span className={`${isSelected ? 'text-white' : 'text-muted'}  text-small w-100 px-1`}>
                        {opt.label}
                      </span>
                    </button>
                  </div>
                )
              })}
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50 fw-bold" onClick={() => setStep(1)}>Atrás</button>
                <button type="button" className="btn btn-success w-50 fw-bold shadow-sm" onClick={handleRegister}>Finalizar</button>
              </div>
            </div>
          )}

          <div className="text-center mt-4 border-top pt-3">
            <span className="text-muted small">¿Ya tienes una cuenta?</span>
            {/* CORRECCIÓN: Antes usaba <a href>. 
                            Lo cambié por <Link> porque esto es una SPA (Single Page Application) y si usas 'a' recargas toda la página, perdiendo el estado. */}
            <Link to="/login" className="ms-2 text-primary fw-bold text-decoration-none small">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};