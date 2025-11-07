import React, { useState } from "react";
import GenerateForm from "./components/GenerateForm";
import Transactions from "./components/Transactions";

export default function App() {
  const [page, setPage] = useState("studio");
  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#0f172a", color: "#fff" }}>
        <div>🌍 GlobalArtPro</div>
        <nav>
          <button onClick={()=>setPage("studio")} style={{ marginRight: 8 }}>Studio</button>
          <button onClick={()=>setPage("transactions")}>Transactions</button>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        {page === "studio" ? <GenerateForm /> : <Transactions />}
      </main>
    </div>
  );
}