import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  worldIdVerified: boolean;
  avatar?: string;
  specialization?: string; // for doctors
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  setDemoMode: (role: 'patient' | 'doctor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo users for quick testing
  const demoUsers: Record<string, User> = {
    patient: {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'patient',
      worldIdVerified: true,
      avatar: 'JS',
    },
    doctor: {
      id: '2',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@medvault.com',
      role: 'doctor',
      worldIdVerified: true,
      avatar: 'ER',
      specialization: 'Cardiologist',
    },
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo login logic
    if (email.includes('doctor') || email.includes('dr.')) {
      setUser(demoUsers.doctor);
    } else {
      setUser(demoUsers.patient);
    }
    setIsLoading(false);
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'patient',
      worldIdVerified: false,
      avatar: userData.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
      specialization: userData.specialization,
    };
    
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const setDemoMode = (role: 'patient' | 'doctor') => {
    setUser(demoUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        setDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};