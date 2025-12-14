import React, { useEffect, useState } from "react";

export default function Donations() {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // stages: idle -> intro -> machine -> paid
  const [stage, setStage] = useState("idle");
  const [copied, setCopied] = useState(false);
  const [showSoon, setShowSoon] = useState(false);

  const cryptoAddress = "ARTC1qxyZ-EXEMPLE-9a8b7c6d";

  useEffect(() => {
    let t;
    if (stage === "intro") {
      // After 4.5s, show the donation machine
      t = setTimeout(() => setStage("machine"), 4500);
    }
    return () => clearTimeout(t);
  }, [stage]);

  const handleStart = (e) => {
    e && e.preventDefault();
    // start the intro animation
    setStage("intro");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cryptoAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
      setCopied(false);
    }
  };

  const handlePaid = () => {
    setStage("paid");
  };

  const handleAccessFoundation = () => {
    setShowSoon(true);
    setTimeout(() => setShowSoon(false), 2200);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mt-10 relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Faire un Don</h2>

      <p className="text-gray-600 mb-6 text-center">
        Votre soutien contribue directement à la préservation, la promotion et
        l’expansion de nos projets culturels, artistiques et technologiques.
      </p>

      {/* Simple form to collect amount/email (not required to complete the flow) */}
      <form onSubmit={handleStart} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Montant du don (€)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            placeholder="Ex : 10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Votre email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Message (facultatif)</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows="3"
            placeholder="Laissez un message si vous le souhaitez…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition duration-200"
        >
          Faire un Don
        </button>
      </form>

      {/* Overlay: intro screen */}
      {stage !== "idle" && (
        <div className="don-overlay" aria-hidden={stage === "idle" ? "true" : "false"}>
          {stage === "intro" && (
            <div className="intro-screen">
              <h1 className="intro-title">Bienvenue à la fondation GlobalArtPro</h1>
            </div>
          )}

          {stage === "machine" && (
            <div className="machine-box" role="dialog" aria-modal="true">
              <div className="qr-area">
                {/* Simple SVG QR placeholder */}
                <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                  <rect width="220" height="220" rx="12" fill="#fff" stroke="#e5e7eb" />
                  <g fill="#111">
                    <rect x="18" y="18" width="44" height="44" />
                    <rect x="158" y="18" width="44" height="44" />
                    <rect x="18" y="158" width="44" height="44" />
                    {/* decorative squares */}
                    <rect x="84" y="84" width="16" height="16" />
                    <rect x="110" y="110" width="12" height="12" />
                    <rect x="140" y="140" width="10" height="10" />
                  </g>
                </svg>
              </div>

              <div className="machine-controls">
                <div className="address-row">
                  <div className="address-label">Adresse crypto</div>
                  <div className="address-value">{cryptoAddress}</div>
                </div>

                <div className="buttons-row">
                  <button onClick={handleCopy} className="btn btn-copy">
                    {copied ? "Copié" : "Copier l'adresse"}
                  </button>

                  <button onClick={() => window.open('#', '_blank')} className="btn btn-qr">
                    Ouvrir paiement (QR)
                  </button>
                </div>

                <div className="paid-row">
                  <button onClick={handlePaid} className="btn btn-paid">
                    J'ai payé
                  </button>
                </div>
              </div>
            </div>
          )}

          {stage === "paid" && (
            <div className="paid-screen">
              <h2 className="paid-thanks">Merci pour votre contribution.</h2>
              <p className="paid-sub">Votre soutien nous rapproche de nos objectifs.</p>

              <div className="foundation-row">
                <button onClick={handleAccessFoundation} className="btn btn-foundation">
                  Accéder à la fondation
                </button>
                {showSoon && <span className="soon-badge">Bientôt disponible</span>}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`\n        .don-overlay {\n          position: fixed;\n          inset: 0;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          z-index: 60;\n        }\n\n        .intro-screen {\n          width: 100%;\n          height: 100%;\n          background: linear-gradient(180deg, #10b981 0%, #059669 100%);\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        }\n\n        .intro-title {\n          color: white;\n          font-size: 3.2rem;\n          font-weight: 800;\n          text-align: center;\n          transform: translateY(40px) scale(0.9);\n          animation: introIn 1.2s ease-out forwards;\n          padding: 0 20px;\n        }\n\n        @keyframes introIn {\n          to { transform: translateY(0) scale(1); opacity: 1; }\n        }\n\n        .machine-box {\n          background: #ffffff;\n          border-radius: 14px;\n          padding: 22px;\n          box-shadow: 0 10px 40px rgba(2,6,23,0.3);\n          display: flex;\n          gap: 20px;\n          align-items: center;\n          max-width: 760px;\n          width: 92%;\n          animation: popIn 400ms ease-out;\n        }\n\n        @keyframes popIn { from { transform: scale(.96); opacity: 0 } to { transform: scale(1); opacity: 1 } }\n\n        .qr-area { flex: 0 0 240px; display:flex; align-items:center; justify-content:center }\n\n        .machine-controls { flex: 1 }\n        .address-row { font-size: 0.95rem; margin-bottom:12px }\n        .address-label { color: #6b7280; font-size:0.85rem }\n        .address-value { font-family: monospace; background:#f3f4f6; padding:8px 10px; border-radius:8px; margin-top:6px; display:inline-block }\n        .buttons-row { display:flex; gap:10px; margin-top:12px }\n        .btn { padding:10px 14px; border-radius:8px; border:none; cursor:pointer }\n        .btn-copy{ background:#111827; color:#fff }\n        .btn-qr{ background:#3b82f6; color:#fff }\n        .btn-paid{ margin-top:14px; background:linear-gradient(90deg,#10b981,#059669); color:#fff; width:100%; font-weight:600 }\n\n        .paid-screen { background: #0f172a; color: #fff; padding:28px; border-radius:12px; text-align:center; max-width:640px; width:90%; }\n        .paid-thanks { font-size:1.8rem; margin-bottom:8px }\n        .paid-sub { color:#cbd5e1; margin-bottom:16px }\n        .foundation-row { display:flex; align-items:center; gap:12px; justify-content:center }\n        .btn-foundation { background:#7c3aed; color:#fff; padding:10px 16px; border-radius:8px }\n        .soon-badge { background:#f3f4f6; color:#111827; padding:6px 10px; border-radius:999px; font-weight:600 }\n\n        @media (max-width:640px) {\n          .intro-title { font-size:2rem }\n          .machine-box { flex-direction:column; padding:18px }\n          .qr-area{ flex:unset }\n        }\n      `}</style>
    </div>
  );
}