import React, { useContext, useState, useEffect, createContext, ReactNode } from 'react';
import { onAuthStateChanged, logout as authLogout } from '../services/authService';
import type { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true, logout: () => Promise.resolve() });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, loading, logout: authLogout };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};