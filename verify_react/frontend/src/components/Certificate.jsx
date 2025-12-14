import React, { useState } from "react";

export default function Certificate() {
  const [nftId, setNftId] = useState("");

  const generateCertificate = () => {
    alert(`Certificat généré pour NFT: ${nftId}`);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "2rem auto" }}>
      <h1>📜 Générer un Certificat d'Authenticité</h1>

      <div style={{ background: "#f5f5f5", padding: "2rem", borderRadius: "8px", marginTop: "2rem" }}>
        <label>ID de l'œuvre NFT :</label>
        <input
          type="text"
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
          placeholder="Entrez l'ID de votre NFT"
          style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button onClick={generateCertificate} style={{ marginTop: "1rem", padding: "0.8rem 1.5rem", background: "#16c784", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Générer le certificat
        </button>
      </div>
    </div>
  );
}