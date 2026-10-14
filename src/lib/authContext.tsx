import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser } from '../types';
import { getSupabaseClient } from './supabase';

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, company?: string) => Promise<boolean>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'funnelpro_current_user';
const USERS_DB_KEY = 'funnelpro_registered_users';

const DEMO_USER: AppUser = {
  id: 'usr-demo-01',
  name: 'Netto Corretor & Estrategista',
  email: 'nettocorretorjdgi@gmail.com',
  company: 'Imóveis & Vendas Digitais',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
  createdAt: '2026-09-01T10:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for persistent user session
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to demo user on first visit so user can explore immediately
        setUser(DEMO_USER);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
      }
    } catch (e) {
      console.warn('Erro ao restaurar sessão de usuário:', e);
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = () => setAuthError(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    // Validation
    if (!email || !password) {
      setAuthError('Por favor, informe e-mail e senha.');
      setIsLoading(false);
      return false;
    }

    if (password.length < 6) {
      setAuthError('A senha deve conter no mínimo 6 caracteres.');
      setIsLoading(false);
      return false;
    }

    // Try Supabase Auth if client is configured
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          const loggedUser: AppUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            company: data.user.user_metadata?.company || 'FunilPro Enterprise',
            role: 'admin',
            createdAt: data.user.created_at,
          };
          setUser(loggedUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
          setIsLoading(false);
          return true;
        }
      } catch (err) {
        console.warn('Supabase Auth tentou login:', err);
      }
    }

    // Local authentication fallback
    try {
      const storedUsersRaw = localStorage.getItem(USERS_DB_KEY);
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const found = registeredUsers.find(
        (u: { email: string; pass: string }) => u.email.toLowerCase() === email.toLowerCase() && u.pass === password
      );

      if (found) {
        const loggedUser: AppUser = {
          id: found.id || `usr-${Date.now()}`,
          name: found.name,
          email: found.email,
          company: found.company || 'Minha Empresa',
          role: 'admin',
          createdAt: found.createdAt || new Date().toISOString(),
        };
        setUser(loggedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
        setIsLoading(false);
        return true;
      }

      // Check demo credentials
      if (email.toLowerCase() === DEMO_USER.email.toLowerCase()) {
        setUser(DEMO_USER);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
        setIsLoading(false);
        return true;
      }

      setAuthError('E-mail ou senha incorretos. Use o botão "Entrar como Demo" ou crie uma nova conta.');
      setIsLoading(false);
      return false;
    } catch {
      setAuthError('Ocorreu um erro ao processar o login. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, company?: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    if (!name.trim()) {
      setAuthError('Por favor, informe seu nome completo.');
      setIsLoading(false);
      return false;
    }

    if (!email || !email.includes('@')) {
      setAuthError('Informe um e-mail válido.');
      setIsLoading(false);
      return false;
    }

    if (!password || password.length < 6) {
      setAuthError('A senha deve ter pelo menos 6 caracteres.');
      setIsLoading(false);
      return false;
    }

    // Attempt Supabase Auth signup
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, company: company || 'Minha Empresa' },
          },
        });

        if (!error && data.user) {
          const newUser: AppUser = {
            id: data.user.id,
            email: data.user.email || email,
            name,
            company: company || 'Minha Empresa',
            role: 'admin',
            createdAt: data.user.created_at,
          };
          setUser(newUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return true;
        }
      } catch (err) {
        console.warn('Supabase SignUp tentado:', err);
      }
    }

    // Local registration
    try {
      const storedUsersRaw = localStorage.getItem(USERS_DB_KEY);
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (registeredUsers.some((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase())) {
        setAuthError('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
        setIsLoading(false);
        return false;
      }

      const newUser: AppUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        company: company || 'Minha Empresa',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      registeredUsers.push({
        id: newUser.id,
        name,
        email,
        pass: password,
        company,
        createdAt: newUser.createdAt,
      });

      localStorage.setItem(USERS_DB_KEY, JSON.stringify(registeredUsers));
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch {
      setAuthError('Falha ao criar conta. Tente novamente.');
      setIsLoading(false);
      return false;
    }
  };

  const loginDemo = () => {
    setUser(DEMO_USER);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
    setAuthError(null);
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Erro ao deslogar do Supabase:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        authError,
        login,
        register,
        loginDemo,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
