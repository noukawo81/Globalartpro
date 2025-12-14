import React from "react";

export default function RecentGrid() {
  const recents = [
    { id: 1, title: "Sunset", thumb: "https://via.placeholder.com/100x100?text=Sunset" },
    { id: 2, title: "Ocean", thumb: "https://via.placeholder.com/100x100?text=Ocean" },
    { id: 3, title: "Forest", thumb: "https://via.placeholder.com/100x100?text=Forest" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
      {recents.map((item) => (
        <div key={item.id} style={{ cursor: "pointer", borderRadius: "6px", overflow: "hidden" }}>
          <img src={item.thumb} alt={item.title} style={{ width: "100%", aspectRatio: "1" }} />
        </div>
      ))}
    </div>
  );
}