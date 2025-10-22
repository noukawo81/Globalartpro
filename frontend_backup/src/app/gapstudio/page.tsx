"use client";
import React, { useState } from "react";

export default function GapStudio() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("image");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSaved(false);

    // Appel à ton backend qui gère l'API IA
    const res = await fetch("http://localhost:5000/api/gapstudio/generate", {
      // Remplace par l'URL de ton backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, type }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!result) return;
    const user = "Visiteur"; // Remplace par l'utilisateur connecté si besoin
    let content =
      type === "image"
        ? result.imageUrl
        : type === "musique"
        ? result.audioUrl
        : result.text;
    const res = await fetch("http://localhost:5000/api/gapstudio/save", {
      // Remplace par l'URL de ton backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, type, prompt, content }),
    });
    if (res.ok) setSaved(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black py-12 px-4">
      <div className="bg-black bg-opacity-70 rounded-3xl shadow-2xl border border-gray-800 max-w-xl w-full p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-2 text-center">
          GAP Studio IA
        </h1>
        <p className="text-gray-200 text-center mb-8">
          Crée une œuvre unique avec l’intelligence artificielle.<br />
          Décris ton idée, choisis le type de création, et laisse la magie opérer !
        </p>
        <form onSubmit={handleGenerate} className="mb-6">
          <input
            className="w-full p-3 mb-3 rounded bg-gray-900 text-white placeholder-gray-400"
            placeholder="Décris ton idée (ex: Un masque africain futuriste en violet et or)"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            required
          />
          <select
            className="w-full p-3 mb-3 rounded bg-gray-900 text-yellow-300"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="image">Image</option>
            <option value="musique">Musique</option>
            <option value="texte">Légende/Poème</option>
          </select>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
            disabled={loading}
          >
            {loading ? "Génération en cours..." : "Générer"}
          </button>
        </form>

        {/* Affichage du résultat */}
        {result && (
          <div className="my-6 text-center">
            {type === "image" && (
              <img
                src={result.imageUrl}
                alt="Création IA"
                className="mx-auto rounded-lg mb-2 shadow-lg"
                style={{ maxWidth: 400 }}
              />
            )}
            {type === "musique" && (
              <audio controls src={result.audioUrl} className="mx-auto mb-2" />
            )}
            {type === "texte" && (
              <blockquote className="bg-yellow-100 bg-opacity-10 p-4 rounded text-yellow-300">
                {result.text}
              </blockquote>
            )}
            <button
              onClick={handleSave}
              className="mt-4 py-2 px-6 bg-purple-700 text-yellow-200 rounded-full font-bold hover:bg-purple-800 transition"
              disabled={saved}
            >
              {saved ? "Création sauvegardée !" : "Sauvegarder cette création"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}