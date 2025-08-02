import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoutes = () => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const res = await fetch('/me', { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            }
        };
        checkUser();
    }, []);

    if (user === undefined) return null;
    return user ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;