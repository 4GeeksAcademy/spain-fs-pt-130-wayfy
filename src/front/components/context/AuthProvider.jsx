import react, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

// Este componente se encarga de proporcionar el contexto del usuario a toda la aplicación
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem("token") || null);

    // Funcion para loguear, guarda el token en la memoria y en el localStorage
    const login = (newToken) => {
        sessionStorage.setItem("token", newToken);
        setToken(newToken);
    }
    // Funcion para desloguear
    const logout = () => {
        sessionStorage.removeItem("token");
        setToken(null);
    }

    // Se comparte el token y las funciones con toda la aplicacion
    return (
        <UserContext.Provider value={{ token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};