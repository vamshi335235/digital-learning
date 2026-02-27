'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getSession, saveSession, clearSession, seedAdmin, ROLES } from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            // Always try to seed admin (the fn guards itself with a flag)
            try { await seedAdmin(); } catch { }

            // Restore saved session
            const session = getSession();
            if (session) setUser(session);

            setLoading(false);
        };
        init();
    }, []);

    const login = (sessionUser) => {
        saveSession(sessionUser);
        setUser(sessionUser);
    };

    const logout = () => {
        clearSession();
        setUser(null);
    };

    const isAdmin = user?.role === ROLES.ADMIN;
    const isUser = user?.role === ROLES.USER || isAdmin;
    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{
            user, login, logout, loading,
            isLoggedIn, isAdmin, isUser,
            role: user?.role || ROLES.GUEST,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
