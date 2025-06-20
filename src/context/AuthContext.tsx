import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import React from "react";
import { isAuthenticated } from "@/utils/auth";

interface AuthContextType {
    token: string | null;
    login: (username: string, password: string, recaptchaToken: string) => Promise<void>;
    logout: () => void;
    loginWithTokens: (accessToken: string, refreshToken: string) => void;
    isAuthenticated: boolean;
    isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateToken = async () => {
            const tokenInStorage = localStorage.getItem("token");
            if (tokenInStorage) {
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenInStorage}`;
                try {
                    await api.get("/me/");
                    setToken(tokenInStorage);
                } catch (error) {
                    setToken(null);
                    localStorage.removeItem("token");
                }
            }
            setIsLoading(false);
        };

        validateToken();
    }, []);

    const login = async (username: string, password: string, recaptchaToken: string) => {
        const response = await api.post("/token/", { username, password, recaptchaToken: recaptchaToken });
        const access = response.data.access;
        const refresh = response.data.refresh;
        
        localStorage.setItem("token", access);
        localStorage.setItem("refreshToken", refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        setToken(access);
    };

    const loginWithTokens = (accessToken: string, refreshToken: string) => {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setToken(accessToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    };
    
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
    };
    
    if (isLoading) {
        return <div>Carregando...</div>; 
    }

    const value = {
        token,
        login,
        logout,
        loginWithTokens,
        isAuthenticated: !!token,
        isLoading,
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;