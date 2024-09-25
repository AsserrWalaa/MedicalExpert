import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth";

// Define the props for the ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  return user ? <>{children}</> : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
