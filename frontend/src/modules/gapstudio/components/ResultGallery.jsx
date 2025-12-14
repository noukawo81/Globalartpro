import React from "react";

const ResultatGallery = ({ results = [] }) => {
  if (!results.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucun résultat pour le moment. Lance une génération.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {results.map((item, index) => (
        <div
          key={index}
          className="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
        >
          <img
            src={item.url}
            alt={`result-${index}`}
            className="object-cover w-full h-40"
          />
          <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-xs p-1 text-center">
            {item.prompt || "Image générée"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultatGallery;