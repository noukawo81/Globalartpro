import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes.jsx";
import NavigationBar from "@/shared/NavigationBar.jsx";
import { AuthProvider } from "@/core/context/AuthContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}