import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function checkUser () {
            try {
                const res = await fetch('/me', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch(err) {
                if 
            }
        }
    }, []);
};