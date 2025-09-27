import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor";
  avatar?: string;
  specialization?: string; // for doctors
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  setDemoMode: (role: "patient" | "doctor") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isInitialized, setIsInitialized] = useState(false);

  // Demo users for quick testing
  const demoUsers: Record<string, User> = {
    patient: {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      role: "patient",
      avatar: "JS",
    },
    doctor: {
      id: "2",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@medvault.com",
      role: "doctor",
      avatar: "ER",
      specialization: "Cardiologist",
    },
  };

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("dr-hedera-user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        localStorage.removeItem("dr-hedera-user");
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo login logic
    let selectedUser;
    if (email.includes("doctor") || email.includes("dr.")) {
      selectedUser = demoUsers.doctor;
    } else {
      selectedUser = demoUsers.patient;
    }

    setUser(selectedUser);
    localStorage.setItem("dr-hedera-user", JSON.stringify(selectedUser));
    setIsLoading(false);
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "patient",
      avatar:
        userData.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "U",
      specialization: userData.specialization,
    };

    setUser(newUser);
    localStorage.setItem("dr-hedera-user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dr-hedera-user");
  };

  const setDemoMode = (role: "patient" | "doctor") => {
    const selectedUser = demoUsers[role];
    setUser(selectedUser);
    localStorage.setItem("dr-hedera-user", JSON.stringify(selectedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitialized,
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
