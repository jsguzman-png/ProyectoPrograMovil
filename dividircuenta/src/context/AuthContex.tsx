import { createContext, useContext, useState } from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User;
  isAllowed: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

// 1. Crear el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 2. Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

// 3. Proveedor del contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAllowed, setIsAllowed] = useState(false);

  // TODO (Supabase): reemplazar por llamada real a supabase.auth.signInWithPassword()
  const login = (email: string, password: string) => {
    const allowed = email.endsWith('.edu');
    if (allowed) {
      setUser({ email });
      setIsAllowed(true);
    }
    return allowed;
  };

  const logout = () => {
    // TODO (Supabase): llamar a supabase.auth.signOut()
    setUser(null);
    setIsAllowed(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAllowed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};