import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Role, User } from '@/types';
import { users } from '@/data/mockData';

interface AuthContextValue {
  user: User | null;
  role: Role;
  login: (employeeId: string, password: string) => User | null;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('admin');

  const login = (employeeId: string, _password: string): User | null => {
    const term = employeeId.trim().toLowerCase();
    const adminUser = users.find((u) => u.role === 'admin') || {
      id: 'admin1',
      name: 'Admin Root',
      employeeId: 'ADM001',
      email: 'admin@hat.co',
      teamId: 't1',
      teamName: 'Phoenix',
      score: 0,
      rank: 0,
      status: 'active',
      role: 'admin',
      activitiesCompleted: 0,
      avatarColor: '#0f172a',
      joinedDate: '2025-01-01',
      lastActive: 'Just now',
    };

    if (term === 'admin' || term === 'adm001' || term === 'admin@hat.co') {
      const targetAdmin = { ...adminUser, role: 'admin' as Role };
      setUser(targetAdmin);
      setRole('admin');
      return targetAdmin;
    }

    const found = users.find(
      (u) =>
        u.employeeId.toLowerCase() === term ||
        u.email.toLowerCase() === term
    );

    if (found) {
      setUser(found);
      setRole(found.role);
      return found;
    }

    return null;
  };

  const logout = () => {
    setUser(null);
    setRole('user');
  };


  const switchRole = (r: Role) => setRole(r);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
