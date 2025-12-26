import React, { useState } from "react";
import { Link } from "react-router-dom";
import DonationModal from "@/components/don/DonationModal.jsx";

export default function NavigationBar() {
  const [openDon, setOpenDon] = useState(false);

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/">Accueil</Link>
        <Link to="/artists">Artistes</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/museum">Galerie</Link>
        <Link to="/gapstudio">GAP Studio</Link>
        <Link to="/wallet">Portefeuille</Link>
        <Link to="/portal-culture">Salon VIP</Link>

        {/* Ouvrir le modal de don */}
        <span style={styles.link} onClick={() => setOpenDon(true)}>
          Donations
        </span>

        <Link to="/mine-artc">Miner ARTC</Link>
        <Link to="/manifeste">Manifeste</Link>
      </nav>

      {/* Modal Donations */}
      <DonationModal open={openDon} onClose={() => setOpenDon(false)} />
    </>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "1rem",
    padding: "1rem",
    background: "#1a1a2e",
    color: "#fff",
    flexWrap: "wrap",
  },
  link: {
    cursor: "pointer",
    color: "white",
  }
}; 