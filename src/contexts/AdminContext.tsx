
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  currentAdmin: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing authentication
    const storedAuth = localStorage.getItem("adminAuth");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      setIsAuthenticated(true);
      setCurrentAdmin(authData.email);
    }
  }, []);

  // For development purposes, use a simple hardcoded admin
  // In production, this should be replaced with a proper authentication system
  const login = async (email: string, password: string) => {
    // For simplicity, we'll accept only one admin account for now
    if (email === "jay@germanexilesrl.co.uk" && password === "admin123") {
      setIsAuthenticated(true);
      setCurrentAdmin(email);
      localStorage.setItem("adminAuth", JSON.stringify({ email }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    localStorage.removeItem("adminAuth");
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout, currentAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
