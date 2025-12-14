import React, { useState, useEffect } from "react";

export default function Discover() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch("/legacy/data/gallery.json")
      .then(r => r.json())
      .then(data => setArtworks(data))
      .catch(e => console.log("gallery.json error", e));
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>🌍 Portail Culture — Découvrir les Artistes</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
        {artworks.length > 0 ? (
          artworks.map((art, idx) => (
            <div key={idx} style={{ background: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <img src={art.image || "/legacy/image/placeholder.jpg"} alt={art.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "1rem" }}>
                <h3>{art.title}</h3>
                <p>{art.description}</p>
                <p><strong>Artiste:</strong> {art.artist}</p>
                <p><strong>Prix:</strong> {art.price} Pi</p>
                <button style={buttonStyle}>Voir plus</button>
              </div>
            </div>
          ))
        ) : (
          <p>Chargement des galeries...</p>
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "0.6rem 1rem",
  background: "#ffcc00",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};