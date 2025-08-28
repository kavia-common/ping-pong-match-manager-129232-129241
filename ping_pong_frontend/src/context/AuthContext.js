import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access authentication context: user, login, register, logout.
 */
const AuthContext = createContext(null);

const STORAGE_KEY = 'pp.auth.user';
const USERS_KEY = 'pp.auth.users';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Provides access to auth context. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * AuthProvider manages simple localStorage-based auth for demo purposes.
   * Not secure for production; replace with real backend.
   */
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = readJSON(STORAGE_KEY, null);
    if (saved) setUser(saved);
  }, []);

  const login = (email, password) => {
    const users = readJSON(USERS_KEY, []);
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      throw new Error('Invalid credentials');
    }
    setUser(found);
    writeJSON(STORAGE_KEY, found);
    return found;
  };

  const register = (name, email, password) => {
    const users = readJSON(USERS_KEY, []);
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const newUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    writeJSON(USERS_KEY, users);
    setUser(newUser);
    writeJSON(STORAGE_KEY, newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
