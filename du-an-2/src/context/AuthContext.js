import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: null,
        username: null,
        role: null,
        userId: null,
        isAuthenticated: false
    });
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');

        if (token && username) {
            setAuth({
                token,
                username,
                role,
                userId,
                isAuthenticated: true
            });
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setAuth({
            token: null,
            username: null,
            role: null,
            userId: null,
            isAuthenticated: false
        });
    };

    return (
        <AuthContext.Provider value={{ ...auth, setAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
