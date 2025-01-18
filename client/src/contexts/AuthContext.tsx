// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BASE_URL } from "../App";
import { useLocation, useNavigate } from "react-router-dom";
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: (username: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const loginAt = localStorage.getItem("login_at");

    const TIME_LIMIT = 60 * 60 * 1000; //one hour

    if (token && userData && loginAt) {
      const currentTime = new Date();
      const loginTime = new Date(loginAt);
      const timeDiff = currentTime.getTime() - loginTime.getTime();
      if (timeDiff < TIME_LIMIT) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_at");
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    try {
      const response = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("login_at", data.login_at);
        setIsAuthenticated(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Protected Route Component
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location, isLoading]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
}
