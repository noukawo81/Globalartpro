import React, { useState, useEffect } from "react";
import { gapstudioAPI } from "../services/gapstudio.api.js";
import "./generateForm.css";

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photoreal");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerateImage() {
    if (!prompt.trim()) return alert("Décris ton image.");

    setLoading(true);
    setStatus("⏳ Génération en cours...");
    setPreviewUrl(null);

    try {
      const data = await gapstudioAPI.generateImage({
        prompt,
        style,
        width: 1024,
        height: 1024,
      });

      const url = data.url || data.image;
      if (!url) throw new Error("Aucune image reçue");

      setPreviewUrl(url);
      setStatus("✅ Image générée.");
    } catch (err) {
      setStatus("❌ Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>🎨 Générateur d'Images</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Décris ton image..."
        rows={4}
        style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ccc" }}
      />

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10, borderRadius: 6 }}
      >
        <option value="photoreal">Photo réaliste</option>
        <option value="traditional">Traditionnel</option>
        <option value="surreal">Surréaliste</option>
      </select>

      <button
        onClick={handleGenerateImage}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          background: "#6a11cb",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "⏳ Génération..." : "✨ Générer"}
      </button>

      {previewUrl && (
        <div style={{ marginTop: 20 }}>
          <img src={previewUrl} alt="Generated" style={{ width: "100%", borderRadius: 6 }} />
        </div>
      )}

      {status && <p style={{ marginTop: 10, textAlign: "center" }}>{status}</p>}
    </div>
  );
}