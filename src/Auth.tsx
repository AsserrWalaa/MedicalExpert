import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  user: any; // You can replace 'any' with a more specific type for the user
  token: string | null;
  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error parsing localStorage data", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  const contextData = {
    user,
    setUser,
    token,
    setToken,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
