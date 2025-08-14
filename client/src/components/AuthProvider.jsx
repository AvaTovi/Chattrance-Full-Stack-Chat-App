import React, { useState, useEffect, useContext, useMemo } from 'react';
import { LOGIN, LOGOUT, USER } from '../shared/endpoints';

const AuthContext = React.createContext();

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
                console.error(`Error fetching ${USER}`, err);
            } finally {
                setLoading(false);
            }
        }
        checkUser();
    }, []);

    async function login(username, password, rememberPassword) {
        try {
            const res = await fetch(LOGIN, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, rememberPassword })
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, message: data.message };
            }
            setAuthUser(data.user);
            return { success: true, message: data.message };
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
                return { success: true, message: data.message }
            }
            return { success: false, message: data.message };
        } catch (err) {
            console.error('Logout error:', err);
            return { success: false, message: err.message };
        }
    }

    const value = useMemo(() => ({
        authUser,
        loading,
        login,
        logout,
    }), [authUser, loading]);

    return (
        <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
    );
};