import { createContext, useState, useEffect, type ReactNode } from "react";
import { getUser, logout as apiLogout } from "../services/api";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  setUserLoggedIn: (userData: any) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUserLoggedIn: () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const data = await getUser();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const setUserLoggedIn = (userData: any) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUserLoggedIn, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
