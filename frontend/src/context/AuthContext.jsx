import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://awt-final-project-backend.vercel.app";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await axios.get("/api/auth/me");
            if (res.data.authenticated) {
                setUser(res.data.user);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (enrollment, password) => {
        const res = await axios.post("/api/login", { enrollment, password });
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        await axios.post("/api/logout");
        setUser(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
