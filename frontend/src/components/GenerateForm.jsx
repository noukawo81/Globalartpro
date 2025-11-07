import React, { useState } from "react";
import API from "../services/api";

export default function GenerateForm() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("replicate-image");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await API.post("/generate", { prompt, type });
      setResult(res.data);
    } catch (err) {
      console.error("generate error:", err);
      setResult({ success: false, message: "Erreur réseau", details: err.message });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>🎨 GAP Studio</h2>
      <form onSubmit={handleGenerate}>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Décris ton idée..." rows="3" style={{ width: "100%", padding: 8 }} />
        <div style={{ margin: "8px 0" }}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="replicate-image">Image IA (Replicate)</option>
            <option value="murf-tts">Voix IA (Murf)</option>
            <option value="musique">Musique demo</option>
          </select>
          <button style={{ marginLeft: 8 }} disabled={loading}>{loading ? "Génération..." : "Générer"}</button>
        </div>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <pre>{result.message}</pre>
          {result.imageUrl && <img src={result.imageUrl} alt="result" style={{ width: "100%", borderRadius: 8 }} />}
          {result.audioUrl && <audio controls src={result.audioUrl} />}
          {result.details && <details><pre>{JSON.stringify(result.details, null, 2)}</pre></details>}
        </div>
      )}
    </div>
  );
}