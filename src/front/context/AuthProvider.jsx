import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';

// Este componente se encarga de proporcionar el contexto del usuario a toda la aplicación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    // Funcion para loguear, guarda el token en la memoria y en el localStorage
    const login = (userData) => {
        sessionStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
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