"use client"
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ userData: null, isRegistered: false });

    const login = (userData, isRegistered) => {
        setUser({ userData, isRegistered });
    };

    const logout = () => {
        setUser({ userData: null, isRegistered: false });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);