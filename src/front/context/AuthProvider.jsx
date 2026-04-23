import react, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

// Este componente se encarga de proporcionar el contexto del usuario a toda la aplicación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user") || null));
    const [token, setToken] = useState(user ? user.token : null);

    // Funcion para loguear, guarda el token en la memoria y en el localStorage
    const login = (userData) => {
        sessionStorage.setItem("user", JSON.stringify(userData));
        setToken(userData);
    }
    // Funcion para desloguear
    const logout = () => {
        sessionStorage.removeItem("user");
        setUser(null);
    }

    // Se comparte el token y las funciones con toda la aplicacion
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};