"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    email: string;
    role: "admin" | "user";
};

type AuthContextType = {
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Restore from localStorage on reload
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("role");
        const email = localStorage.getItem("email");

        if (token && role && email) {
            setAccessToken(token);
            setUser({ email, role: role as "admin" | "user" });
        }
    }, []);

    async function login(email: string, password: string) {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();

        const { access_token, role } = data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", email);

        setAccessToken(access_token);
        setUser({ email, role });

        router.push("/dashboard");
    }

    function logout() {
        localStorage.clear();
        setAccessToken(null);
        setUser(null);
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
