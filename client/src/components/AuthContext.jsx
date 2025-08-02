import React from 'react';

export const AuthContext = React.createContext({
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
    login: async () => {},
    logout: async () => {},
    signup: async () => {}
});