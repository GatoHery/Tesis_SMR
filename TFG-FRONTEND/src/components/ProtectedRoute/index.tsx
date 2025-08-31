// ** React Imports
import { ReactNode } from "react";

// ** Third Party Imports
import { Navigate } from "react-router";
import { toast } from "react-toastify";

// ** Zustand and Component Imports
import useAuthStore from "@/store/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    toast.error("No tienes permiso para acceder a esta página");
    return;
  }

  return children;
};
