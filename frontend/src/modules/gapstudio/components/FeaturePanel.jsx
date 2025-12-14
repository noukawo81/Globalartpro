import React from "react";

const FeaturePanel = ({ features = [], onSelect }) => {
  if (!features.length) {
    features = [
      { id: "enhance", label: "Amélioration IA" },
      { id: "upscale", label: "Ultra-Résolution" },
      { id: "variation", label: "Variantes" },
    ];
  }

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="font-semibold text-lg mb-3">Fonctionnalités</h3>
      <div className="flex flex-col gap-2">
        {features.map((feat) => (
          <button
            key={feat.id}
            onClick={() => onSelect && onSelect(feat.id)}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-left rounded-lg transition"
          >
            {feat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeaturePanel;