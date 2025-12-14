import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth.js";

/**
 * ProtectedRoute
 * Vérifie si l'utilisateur est authentifié avant d'afficher la page protégée.
 */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Redirect to the artists page which contains the login tab
    return <Navigate to="/artists" replace />;
  }

  return children;
}