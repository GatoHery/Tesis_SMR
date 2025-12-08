// ** React Imports
import { ReactNode } from "react";

// ** Third Party Imports
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import FullPageLoader from "@/components/FullPageLoader";

// ** Zustand and Component Imports
import useAuthStore from "@/store/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();


  if(isAuthenticated === null) {
    toast.info("Verificando autenticación...");
    console.log("isAuthenticated is null, showing loader");
    return <FullPageLoader />;
  }

  

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    toast.error("No tienes permiso para acceder a esta página");
    return null;
  }

  return children;
};
