import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createEmptyProfile } from '../utils/careerEngine';

const AuthContext = createContext(null);

const USERS_KEY = 'careerpath_users';
const SESSION_KEY = 'careerpath_session';

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const users = loadUsers();
      const found = users[session];
      if (found) setUser(found);
      else localStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const register = useCallback(({ name, email, password }) => {
    const users = loadUsers();
    if (users[email]) throw new Error('An account with this email already exists.');
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      profile: createEmptyProfile(),
      createdAt: new Date().toISOString()
    };
    users[email] = newUser;
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    setUser(newUser);
    return newUser;
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = loadUsers();
    const found = users[email];
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password.');
    }
    localStorage.setItem(SESSION_KEY, email);
    setUser(found);
    return found;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    profileUpdate => {
      if (!user) return;
      const users = loadUsers();
      const updated = {
        ...user,
        profile: { ...user.profile, ...profileUpdate, updatedAt: new Date().toISOString() }
      };
      users[user.email] = updated;
      saveUsers(users);
      setUser(updated);
      return updated;
    },
    [user]
  );

  const isProfileComplete = user?.profile?.preferredCareer && (user?.profile?.skills?.length || 0) > 0;

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile, isProfileComplete }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
