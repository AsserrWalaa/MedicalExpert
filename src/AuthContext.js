import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import toast from "react-hot-toast";
import { Api } from "../services";
import { useState } from "react";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(null, "user");
  const [loading, setLoading] = useState();

  const navigate = useNavigate();

  const login = async (userData) => {
    setLoading(true);
    try {
      //   const response = await Api.post("/auth/login", userData);
      //   if (response.status === 201) {
      //     const data = { token: response.data.token, ...response.data.user };
      //     setUser(() => data);
      //   }

      navigate("/blogs");

      toast.success("user logged in successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
