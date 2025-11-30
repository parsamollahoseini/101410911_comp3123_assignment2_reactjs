import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [user, setUser] = useState(null);

    useEffect(() => {
        setIsAuthenticated(authService.isAuthenticated());
    }, []);

    const login = async (credentials) => {
        const response = await authService.login(credentials);
        setIsAuthenticated(true);
        setUser(response.user);
        return response;
    };

    const signup = async (userData) => {
        const response = await authService.signup(userData);
        return response;
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};