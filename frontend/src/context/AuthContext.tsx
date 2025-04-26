import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
import { chekAuthStatus, loginUser, logoutUser, signupUser } from "../helpers/api-communicator";
  
  type User = {
    name: string;
    email: string;
  };
  
  type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  };
  
  export const AuthContext = createContext<UserAuth | null>(null);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      // ici tu peux récupérer l'utilisateur depuis un localStorage par ex
      // const savedUser = localStorage.getItem("user");
      // if (savedUser) {
      //   setUser(JSON.parse(savedUser));
      //   setIsLoggedIn(true);
      // }
      async function checkStatus () {
        const data = await chekAuthStatus();
        if (data) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
        } 
      }
      checkStatus();
    }, []);
  
    const login = async (email: string, password: string) => {
  
      const data = await loginUser (email , password);
      if (data) {
        setUser({ email: data.email, name: data.name });
        setIsLoggedIn(true);
      }
      // exemple : setIsLoggedIn(true);
    };
  
    const signup = async (name: string, email: string, password: string) => {
      const data = await signupUser(name, email, password);
      if (data) {
        setUser({ email: data.email, name: data.name });
        setIsLoggedIn(true);
      }
    };
  
    const logout = async () => {
      await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
      // exemple : setIsLoggedIn(false);
      // setUser(null);
    };
  
    const value: UserAuth = {
      user,
      isLoggedIn,
      login,
      logout,
      signup,
    };
  
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);
  