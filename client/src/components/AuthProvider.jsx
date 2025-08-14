import React, { useState, useEffect, useContext, useMemo } from 'react';
import { API_ROUTES, FRONTEND_ROUTES } from '../shared/endpoints';

const AuthContext = React.createContext();

const apiUrl = (route) => `/api${route}`;
const USER = apiUrl(API_ROUTES.USER);
const LOGIN = apiUrl(API_ROUTES.LOGIN);
const LOGOUT = apiUrl(API_ROUTES.LOGOUT);
const SIGNUP = apiUrl(API_ROUTES.SIGNUP);

export function useAuth() {
    return useContext(AuthContext);
};

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function clearAuth() {
        setAuthUser(null);
    }

    useEffect(() => {
        checkUser();
    }, []);

    async function signup(username, password, email) {
        try {
            const res = await fetch(SIGNUP, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });
            const data = await res.json();
            return { success: res.ok, message: data.message };
        } catch (err) {
            console.error('Signup error:', err);
            return { success: false, message: err.message };
        }
    }

    async function login(username, password, rememberPassword) {
        try {
            const res = await fetch(LOGIN, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, rememberPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setAuthUser(data.user);
            }
            return { success: res.ok, message: data.message };
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, message: err.message };
        }
    }

    async function logout() {
        try {
            const res = await fetch(LOGOUT, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                clearAuth();
            }
            return { success: res.ok, message: data.message };
        } catch (err) {
            console.error('Logout error:', err);
            return { success: false, message: err.message };
        }
    }

    async function checkUser() {
        try {
            const res = await fetch((USER), {
                credentials: 'include'
            });
            if (res.ok) {
                const userData = await res.json();
                setAuthUser(userData.user);
            } else {
                clearAuth();
            }
        } catch (err) {
            clearAuth();
            console.error('Check User error:', err);
        } finally {
            setLoading(false);
        }
    }

    const value = useMemo(() => ({
        authUser,
        loading,
        signup,
        login,
        logout,
    }), [authUser, loading]);

    return (
        <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
    );
};