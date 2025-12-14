import React, { useState } from "react";

export default function Artist() {
  const [loginMode, setLoginMode] = useState(true);

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "2rem auto" }}>
      <h1>{loginMode ? "Connexion Artiste" : "Créer un compte"}</h1>

      <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input type="email" placeholder="Email" style={inputStyle} />
        <input type="password" placeholder="Mot de passe" style={inputStyle} />
        {!loginMode && <input type="text" placeholder="Nom de l'artiste" style={inputStyle} />}
        <button type="submit" style={buttonStyle}>
          {loginMode ? "Se connecter" : "S'inscrire"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        <button onClick={() => setLoginMode(!loginMode)} style={{ background: "none", border: "none", color: "#16c784", cursor: "pointer" }}>
          {loginMode ? "Créer un compte" : "Se connecter"}
        </button>
      </p>
    </div>
  );
}

const inputStyle = { padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" };
const buttonStyle = { padding: "0.8rem", background: "#16c784", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };