import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Discover from "./components/Discover";
import Artist from "./components/Artist";
import GAPStudio from "./components/GAPStudio";
import Certificate from "./components/Certificate";
import Community from "./components/Community";
import Marketplace from "./components/Marketplace";
import LegacyIframe from "./components/LegacyIframe";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={navStyles}>
        <Link to="/">🏠 Accueil</Link>
        <Link to="/discover">🌍 Découvrir</Link>
        <Link to="/artist">👨‍🎨 Artistes</Link>
        <Link to="/gapstudio">🎨 GAP Studio</Link>
        <Link to="/certificate">📜 Certificat</Link>
        <Link to="/community">👥 Communauté</Link>
        <Link to="/marketplace">🛒 Marketplace</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/artist" element={<Artist />} />
        <Route path="/gapstudio" element={<GAPStudio />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/community" element={<Community />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/legacy/:page" element={<LegacyIframe />} />
      </Routes>
    </BrowserRouter>
  );
}

const navStyles = {
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  background: "#1a1a2e",
  color: "#fff",
  flexWrap: "wrap",
  position: "sticky",
  top: 0,
  zIndex: 100,
};