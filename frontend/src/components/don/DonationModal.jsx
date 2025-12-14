import React, { useState, useEffect } from "react";
import "./donation.css";

export default function DonationModal({ open, onClose }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (open) {
      setStep(1);
      setTimeout(() => setStep(2), 2000);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="don-overlay">
      <div className="don-modal">

        {/* MENU (3 points) */}
        <div className="don-menu">
          <details>
            <summary>⋮</summary>
            <div className="menu-box">
              <p>À propos de nous</p>
              <p>Termes d'utilisation</p>
            </div>
          </details>
        </div>

        {/* STEP 1 — Bienvenue */}
        {step === 1 && (
          <div className="don-step don-fade">
            <h1>Bienvenue à la Fondation Global Art Pro</h1>
          </div>
        )}

        {/* STEP 2 — Contenu */}
        {step === 2 && (
          <div className="don-step don-fade">

            {/* SECTION QR CODE */}
            <div className="don-section">
              <h2>Scanner le QR Code</h2>
              <img
                src="/qr-globalart.png"
                alt="QR Code Don"
                className="don-qr"
              />
            </div>

            {/* SECTION ADRESSE */}
            <div className="don-section">
              <h3>Adresse du portefeuille</h3>
              <div className="don-wallet-box">
                <span>0x1234abcd5678ef00ff00aa998877...</span>
                <button onClick={() => navigator.clipboard.writeText("0x1234abcd5678ef00ff00aa998877...")}>
                  Copier
                </button>
              </div>
            </div>

            {/* SECTION OUVRIR WALLET */}
            <div className="don-section">
              <button
                className="don-wallet-btn"
                onClick={() => window.open("yourwalletlink://send?to=0x1234abcd", "_blank")}
              >
                Ouvrir mon portefeuille
              </button>
            </div>

            {/* SECTION CONTACT */}
            <div className="don-contact">
              <h3>Contactez-nous</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const name = e.target.name.value;
                  const mail = e.target.email.value;

                  window.location.href = `mailto:fondationglobalartpro@gmail.com?subject=Contact Fondation&body=Nom:%20${name}%0AEmail:%20${mail}`;
                }}
              >
                <input name="name" placeholder="Nom" required />
                <input name="email" type="email" placeholder="Email" required />
                <button type="submit">Envoyer via Gmail</button>
              </form>
            </div>

          </div>
        )}

        {/* Bouton fermer */}
        <button className="don-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}