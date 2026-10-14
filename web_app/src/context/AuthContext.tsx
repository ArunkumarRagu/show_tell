import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role, User } from '@/types';
import { loginApi, getMeApi, logoutApi } from '@/api/auth';
import { getToken, removeToken } from '@/api/client';

interface AuthContextValue {
  user: User | null;
  role: Role;
  isLoading: boolean;
  login: (employeeId: string, password?: string) => Promise<User | null>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('user');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (getToken()) {
        const u = await getMeApi();
        setUser(u);
        setRole(u.role);
      } else {
        setUser(null);
        setRole('user');
      }
    } catch (err) {
      console.warn('Could not refresh user session from backend API:', err);
      removeToken();
      setUser(null);
      setRole('user');
    }
  };

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      if (getToken()) {
        try {
          const fetchedUser = await getMeApi();
          if (fetchedUser && fetchedUser.id) {
            setUser(fetchedUser);
            setRole(fetchedUser.role);
          } else {
            removeToken();
            setUser(null);
            setRole('user');
          }
        } catch (err) {
          console.warn('Session restore failed:', err);
          removeToken();
          setUser(null);
          setRole('user');
        }
      } else {
        setUser(null);
        setRole('user');
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const login = async (employeeId: string, password?: string): Promise<User | null> => {
    try {
      const u = await loginApi(employeeId, password);
      setUser(u);
      setRole(u.role);
      return u;
    } catch (err: any) {
      removeToken();
      setUser(null);
      setRole('user');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors on logout
    } finally {
      removeToken();
      setUser(null);
      setRole('user');
    }
  };

  const switchRole = (r: Role) => setRole(r);

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout, switchRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
