import React from "react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      <aside style={{
        width: "250px",
        background: "#222",
        color: "white",
        padding: "20px"
      }}>
        <h3>Admin Panel</h3>
        <p>Menu latéral ici</p>
      </aside>

      <section style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </section>

    </div>
  );
}