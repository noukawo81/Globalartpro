import React, { useState } from "react";
import GenerateForm from "./GenerateForm";

export default function GAPStudio() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>🎨 GAP Studio — Créateur IA</h1>
      <p>Créez des œuvres d'art grâce à l'intelligence artificielle</p>
      
      <GenerateForm />
    </div>
  );
}