import React, { useState } from "react";
import GenerateForm from "../components/GenerateForm";
import ResultatGallery from "../components/ResultatGallery";
import FeaturePanel from "../components/FeaturePanel";
import StatsBoard from "../components/StatsBoard";
import gapstudioApi from "../services/gapstudio.api";

const GAPStudioPage = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalGenerations: 0,
    creditsUsed: 0,
    favoriteCount: 0,
  });

  // Gestion de la génération d'image via API
  const handleGenerate = async (payload) => {
    try {
      const response = await gapstudioApi.generateImage(payload);

      if (response?.url) {
        const newResult = { url: response.url, prompt: payload.prompt };
        setResults((prev) => [newResult, ...prev]);

        // On met à jour les statistiques
        setStats((prev) => ({
          ...prev,
          totalGenerations: prev.totalGenerations + 1,
          creditsUsed: prev.creditsUsed + 1,
        }));
      }
    } catch (error) {
      console.error("Erreur Backend GapStudio:", error);
    }
  };

  // Gestion des fonctionnalités (upscale, enhance…)
  const handleFeatureSelect = async (featureId) => {
    if (!results.length) return;

    const lastImage = results[0];

    try {
      const response = await gapstudioApi.applyFeature({
        feature: featureId,
        imageUrl: lastImage.url,
      });

      if (response?.url) {
        const updated = { url: response.url, prompt: lastImage.prompt };
        setResults((prev) => [updated, ...prev]);
      }
    } catch (e) {
      console.error("Erreur Feature:", e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 flex flex-col gap-6">

      {/* Section Title */}
      <h1 className="text-3xl font-bold text-gray-800">
        GAPStudio – Génération d’Art IA
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Colonne gauche : Formulaire + Fonctionnalités */}
        <div className="col-span-1 flex flex-col gap-6">

          {/* Formulaire de génération */}
          <div className="bg-white p-4 shadow rounded-lg">
            <GenerateForm onGenerate={handleGenerate} />
          </div>

          {/* Panneau des fonctionnalités */}
          <FeaturePanel onSelect={handleFeatureSelect} />
        </div>

        {/* Colonne droite : Résultats & Stats */}
        <div className="col-span-3 flex flex-col gap-6">

          {/* Statistiques */}
          <StatsBoard stats={stats} />

          {/* Galerie */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Résultats</h3>
            <ResultatGallery results={results} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default GAPStudioPage;