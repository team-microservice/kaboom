import { useContext, useEffect } from "react";
import { Navigate } from "react-router";
import AuthContext from "../contexts/auth";
import Swal from "sweetalert2";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkAuth } = useContext(AuthContext);
  const authenticated = checkAuth();

  if (!authenticated) {
    Swal.fire({
      icon: "warning",
      text: "Anda harus login terlebih dahulu",
      title: "Akses Ditolak"
    });
    return <Navigate to="/" replace />;
  }

  return children;
}