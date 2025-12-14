import React from "react";

const StatTile = ({ label, value }) => (
  <div className="p-4 bg-white shadow rounded-lg flex flex-col items-center">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-xl font-bold mt-1">{value}</span>
  </div>
);

const StatsBoard = ({ stats }) => {
  const defaultStats = {
    totalGenerations: 0,
    creditsUsed: 0,
    favoriteCount: 0,
  };

  const data = stats || defaultStats;

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <StatTile label="Images Générées" value={data.totalGenerations} />
      <StatTile label="Crédits Utilisés" value={data.creditsUsed} />
      <StatTile label="Favoris" value={data.favoriteCount} />
    </div>
  );
};

export default StatsBoard;