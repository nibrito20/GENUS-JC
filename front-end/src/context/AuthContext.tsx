import { createContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  user: string | null;          // usuário logado
  login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Inicializa o user lendo do localStorage
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem("user");
  });

  // Função de login
  const login = (username: string) => {
    setUser(username);
    localStorage.setItem("user", username); // salva no navegador
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");       // remove do navegador
  };

  // Optional: sincroniza se localStorage mudar em outra aba
  useEffect(() => {
    const handleStorageChange = () => {
      setUser(localStorage.getItem("user"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
