import { createContext, useContext, useState, type ReactNode } from 'react';

type Role = 'CUSTOMER' | 'ADMIN' | null;

interface AuthContextType {
  userId: number | null;
  name: string | null;
  role: Role;
  login: (id: number, name: string, role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  const login = (id: number, n: string, r: Role) => {
    setUserId(id);
    setName(n);
    setRole(r);
  };

  const logout = () => {
    setUserId(null);
    setName(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{
      userId,
      name,
      role,
      login,
      logout,
      isAuthenticated: userId !== null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
