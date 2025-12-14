import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "@/shared/NavigationBar.jsx";

export default function MainLayout() {
  return (
    <div>
      <NavigationBar />
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}