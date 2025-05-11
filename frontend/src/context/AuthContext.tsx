import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  chekAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
} from "../helpers/api-communicator";

type User = {
  name: string;
  email: string;
  role: "admin" | "user";
  token: string;
};

type UserAuth = {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ redirect: string } | undefined>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    if (data) {
      const role = data.email === "admin@gmail.com" ? "admin" : "user";
      const newUser = {
        email: data.email,
        name: data.name,
        role,
        token: data.token,
      };
      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { redirect: role === "admin" ? "/admin" : "/chat" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await signupUser(name, email, password);
    if (data) {
      const role = data.email === "admin@gmail.com" ? "admin" : "user";
      const newUser = {
        email: data.email,
        name: data.name,
        role,
        token: data.token,
      };
      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await logoutUser(user.token);
      }
    } catch (error) {
      console.error("Erreur lors du logout", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const value: UserAuth = {
    user,
    isLoggedIn,
    loading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
