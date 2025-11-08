import React, { useState } from "react";
import API from "../services/api";

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("replicate-image");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e && e.preventDefault();
    if (!prompt.trim()) {
      setError("Le prompt est vide.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await API.post("/generate", { prompt, type });
      setResult(res.data);
    } catch (err) {
      console.error("generate error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Erreur réseau ou serveur";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>🎨 GAP Studio</h2>

      <form onSubmit={handleGenerate}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Décris ton idée :
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex : portrait d'un chat stylisé en peinture à l'huile..."
          rows={4}
          style={{ width: "100%", padding: 10, borderRadius: 6 }}
        />

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="replicate-image">Image IA (Replicate)</option>
            <option value="murf-tts">Voix IA (Murf)</option>
            <option value="musique">Musique démo</option>
          </select>

          <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
            {loading ? "Génération..." : "Générer"}
          </button>

          <button type="button" onClick={handleClear} style={{ padding: "8px 12px" }}>
            Effacer
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: "crimson" }}>
          <strong>Erreur :</strong> {String(error)}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          {result.message && <pre style={{ whiteSpace: "pre-wrap" }}>{result.message}</pre>}

          {result.imageUrl && (
            <div style={{ marginTop: 12 }}>
              <img
                src={result.imageUrl}
                alt="result"
                style={{ width: "100%", borderRadius: 8, objectFit: "contain" }}
              />
              <div style={{ marginTop: 8 }}>
                <a href={result.imageUrl} download="generated.png">
                  Télécharger l'image
                </a>
              </div>
            </div>
          )}

          {result.audioUrl && (
            <div style={{ marginTop: 12 }}>
              <audio controls src={result.audioUrl} />
            </div>
          )}

          {result.details && (
            <details style={{ marginTop: 12 }}>
              <summary>Détails</summary>
              <pre>{JSON.stringify(result.details, null, 2)}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}