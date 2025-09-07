import React, { useContext, useEffect, useMemo, useState } from "react";

import { API_ROUTES } from "chattrance-shared";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {

  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      checkAuthentication();
      if (!authUser) {
        setAuthUser({ id: -1, username: "TEST", email: "TEST" });
      }
      setLoading(false);
    }
  }, []);

  async function signup(username, password, email) {
    try {
      const res = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Signup error:", err);
    }
  }

  async function login(username, password, rememberMe) {
    try {
      const res = await fetch(API_ROUTES.AUTH.LOGIN, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });
      const data = await res.json();
      if (data.ok) {
        setAuthUser(data.data.user);
      }
      return data;
    } catch (err) {
      console.error("Login error:", err);
    }
  }

  async function logout() {
    try {
      const res = await fetch(API_ROUTES.AUTH.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAuthUser(null);
    }
  }

  async function checkAuthentication() {
    try {
      const res = await fetch(API_ROUTES.USER.GET_USER, {
        credentials: "include"
      });
      const data = await res.json();
      if (data.ok) {
        setAuthUser(data.data.user);
      }
    } catch (err) {
      console.error("Check User error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function requestReset(email) {
    try {
      const res = await fetch(API_ROUTES.AUTH.REQUEST_RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (err) {
      console.error("Request reset error:", err);
    }
  }

  async function resetPassword(id, token, password) {
    try {
      const res = await fetch(API_ROUTES.AUTH.RESET_PASSWORD, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, token, password }),
      });
      return await res.json();
    } catch (err) {
      console.error("Password reset error:", err);
    }
  }

  const value = useMemo(
    () => ({
      authUser,
      loading,
      signup,
      login,
      logout,
      checkAuthentication,
      requestReset,
      resetPassword
    }),
    [authUser, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
