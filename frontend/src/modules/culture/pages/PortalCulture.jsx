import React, { useEffect, useState } from "react";
import { api } from '@/services/api.js';
import { useNavigate } from "react-router-dom";

export default function PortalCulture() {
  const navigate = useNavigate();

  // User state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasVIP, setHasVIP] = useState(false);
  const [userName, setUserName] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState("gallery"); // gallery|stories|countries|salon|vip
  const [vipModal, setVipModal] = useState(false);
  const [selectedVipItem, setSelectedVipItem] = useState(null);

  // Mock data
  const GALLERY_ITEMS = [
    { id: "g1", title: "Masque Fang", country: "Gabon", image: "🎭", description: "Masque rituel sacré utilisé dans les cérémonies", level: "free" },
    { id: "g2", title: "Tissus Kente", country: "Ghana", image: "🧵", description: "Tissus traditionnels tissés à la main", level: "free" },
    { id: "g3", title: "Poterie Zoulou", country: "Afrique du Sud", image: "🏺", description: "Art de la céramique ancestrale", level: "free" },
    { id: "g4", title: "Danses Bamiléké", country: "Cameroun", image: "💃", description: "Danses traditionnelles et rituelles", level: "free" },
  ];

  const STORIES = [
    { id: "s1", title: "L'histoire du Kente", author: "Kwasi Asante", country: "Ghana", level: "free" },
    { id: "s2", title: "Symbolisme des masques", author: "Antoine Kayo", country: "Côte d'Ivoire", level: "free" },
    { id: "s3", title: "Les rituels du Nouvel An Amharique", author: "Abebe Tekle", country: "Éthiopie", level: "free" },
  ];

  const COUNTRIES = [
    { code: "CM", name: "Cameroun", cultures: 180, artists: 45 },
    { code: "SN", name: "Sénégal", cultures: 120, artists: 38 },
    { code: "GH", name: "Ghana", cultures: 95, artists: 32 },
    { code: "ZA", name: "Afrique du Sud", cultures: 150, artists: 50 },
    { code: "KE", name: "Kenya", cultures: 110, artists: 40 },
    { code: "NG", name: "Nigeria", cultures: 250, artists: 80 },
  ];

  const VIP_CONTENT = [
    { id: "vip1", title: "Archives Sacrées — Les Rituels de Passage", description: "Collection exclusive des rituels initiatiques", price: 0.00005, currency: "π" },
    { id: "vip2", title: "Interview : Chef Traditionaliste Camerounais", description: "Entrevue privée avec un gardien des traditions", price: 50, currency: "ARTC" },
    { id: "vip3", title: "Masterclass VIP : Danses Ancestrales", description: "Enseignement direct par un maître", price: 0.00005, currency: "π" },
    { id: "vip4", title: "Musée Virtuel 3D — Temple Sacré Éthiopien", description: "Expérience immersive haute-résolution", price: 100, currency: "ARTC" },
  ];

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        setUserName(userData.name || "Visiteur");
        setHasVIP(localStorage.getItem("vipPass") === "true");
      } catch {}
    }
  }, []);

  const handleVipClick = (item) => {
    if (!isLoggedIn) {
      alert("Connectez-vous pour accéder au contenu premium.");
      navigate("/login");
      return;
    }
    if (hasVIP) {
      alert(`Accès VIP : ${item.title}\n\n${item.description}`);
      return;
    }
    setSelectedVipItem(item);
    setVipModal(true);
  };

  const handleVipPurchase = async (item) => {
    const amount = item.price;
    const token = item.currency === 'π' ? 'PI' : 'ARTC';
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user?.id;
      const res = await api.portalBuy(userId, token, amount);
      if (res?.ok) {
        alert('Achat confirmé — accès débloqué.');
        localStorage.setItem('vipPass', 'true');
        setHasVIP(true);
        setVipModal(false);
      } else {
        alert('Impossible de finaliser l’achat: ' + (res?.error || 'Erreur inconnue'));
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors du paiement : ' + (err?.message || err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("vipPass");
    setIsLoggedIn(false);
    setHasVIP(false);
    setUserName("");
  };

  return (
    <div className="portal-culture-container">
      <style>{`
        .portal-culture-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
          color: #f1f5f9;
          font-family: 'Segoe UI', sans-serif;
        }

        .portal-header {
          position: sticky;
          top: 0;
          background: rgba(15, 20, 25, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 24px;
          z-index: 40;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section h1 {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(90deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .user-section {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .vip-badge {
          background: linear-gradient(90deg, #fbbf24, #f97316);
          color: #000;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .btn-user {
          padding: 8px 14px;
          background: #667eea;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-user:hover {
          background: #764ba2;
        }

        .btn-logout {
          background: #ef4444;
          padding: 6px 12px;
          border: none;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .portal-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .nav-btn {
          padding: 10px 16px;
          border: 2px solid #667eea;
          background: transparent;
          color: #667eea;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 200ms;
        }

        .nav-btn.active {
          background: #667eea;
          color: #fff;
        }

        .nav-btn:hover {
          transform: translateY(-2px);
        }

        .portal-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        /* GALLERY */
        .gallery-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        .gallery-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          transition: all 200ms;
          cursor: pointer;
        }

        .gallery-card:hover {
          border-color: #667eea;
          transform: translateY(-4px);
        }

        .gallery-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
        }

        .gallery-info {
          padding: 16px;
        }

        .gallery-title {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 6px;
        }

        .gallery-meta {
          font-size: 0.85rem;
          color: #cbd5e1;
          margin-bottom: 8px;
        }

        .gallery-desc {
          font-size: 0.9rem;
          color: #e2e8f0;
          line-height: 1.4;
        }

        /* STORIES */
        .stories-section {
          display: grid;
          gap: 16px;
        }

        .story-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 16px;
          cursor: pointer;
          transition: all 200ms;
        }

        .story-card:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .story-icon {
          font-size: 3rem;
          flex-shrink: 0;
        }

        .story-content h3 {
          margin: 0 0 6px 0;
          font-size: 1.2rem;
        }

        .story-author {
          font-size: 0.85rem;
          color: #cbd5e1;
        }

        /* COUNTRIES */
        .countries-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .country-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 200ms;
        }

        .country-card:hover {
          border-color: #667eea;
          transform: scale(1.05);
        }

        .country-flag {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .country-name {
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .country-stats {
          font-size: 0.85rem;
          color: #cbd5e1;
        }

        /* SALON */
        .salon-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 24px;
        }

        .salon-header {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .messages {
          display: grid;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 16px;
        }

        .message {
          background: rgba(102, 126, 234, 0.1);
          padding: 12px;
          border-radius: 8px;
          border-left: 3px solid #667eea;
        }

        .message-author {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .message-text {
          font-size: 0.9rem;
          color: #e2e8f0;
          margin-top: 4px;
        }

        .input-group {
          display: flex;
          gap: 8px;
        }

        .input-group input {
          flex: 1;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: #fff;
        }

        .input-group button {
          padding: 10px 16px;
          background: #667eea;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        /* VIP */
        .vip-section {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .vip-card {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(249, 115, 22, 0.1));
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 200ms;
        }

        .vip-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(251, 191, 36, 0.2);
        }

        .vip-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .vip-title {
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 8px;
          color: #fbbf24;
        }

        .vip-description {
          font-size: 0.9rem;
          color: #e2e8f0;
          margin-bottom: 12px;
        }

        .vip-price {
          font-weight: 700;
          color: #fbbf24;
          margin-bottom: 12px;
        }

        .btn-vip {
          width: 100%;
          padding: 10px;
          background: linear-gradient(90deg, #fbbf24, #f97316);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-vip:hover {
          opacity: 0.9;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-box {
          background: #0f172a;
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          text-align: center;
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: #fbbf24;
        }

        .modal-desc {
          font-size: 0.95rem;
          color: #cbd5e1;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-cancel {
          padding: 10px 16px;
          background: #475569;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn-pay {
          padding: 10px 20px;
          background: linear-gradient(90deg, #fbbf24, #f97316);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #cbd5e1;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 12px;
          }
          .portal-nav {
            flex-direction: column;
          }
          .nav-btn {
            width: 100%;
          }
          .gallery-section, .countries-section, .vip-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="portal-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🌍 Portail Culture GlobalArtPro</h1>
          </div>
          <div className="user-section">
            {isLoggedIn ? (
              <>
                <span>Bienvenue {userName}</span>
                {hasVIP && <div className="vip-badge">👑 VIP</div>}
                <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
              </>
            ) : (
              <button className="btn-user" onClick={() => navigate("/login")}>Connexion</button>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="portal-nav">
        <button className={`nav-btn ${activeTab === "gallery" ? "active" : ""}`} onClick={() => setActiveTab("gallery")}>
          🎨 Galerie Culturelle
        </button>
        <button className={`nav-btn ${activeTab === "stories" ? "active" : ""}`} onClick={() => setActiveTab("stories")}>
          📖 Histoires
        </button>
        <button className={`nav-btn ${activeTab === "countries" ? "active" : ""}`} onClick={() => setActiveTab("countries")}>
          🗺️ Pays & Cultures
        </button>
        <button className={`nav-btn ${activeTab === "salon" ? "active" : ""}`} onClick={() => setActiveTab("salon")}>
          💬 Salon Public
        </button>
        <button className={`nav-btn ${activeTab === "vip" ? "active" : ""}`} onClick={() => setActiveTab("vip")}>
          👑 Accès VIP
        </button>
      </div>

      {/* CONTENT */}
      <div className="portal-content">
        {/* GALLERY */}
        {activeTab === "gallery" && (
          <section>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>Galerie Culturelle Mondiale</h2>
            <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
              Découvrez l'art, les traditions et les cultures du monde entier. Gratuit et accessible à tous.
            </p>
            <div className="gallery-section">
              {GALLERY_ITEMS.map((item) => (
                <div key={item.id} className="gallery-card">
                  <div className="gallery-image">{item.image}</div>
                  <div className="gallery-info">
                    <div className="gallery-title">{item.title}</div>
                    <div className="gallery-meta">📍 {item.country}</div>
                    <div className="gallery-desc">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STORIES */}
        {activeTab === "stories" && (
          <section>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>Histoires Culturelles</h2>
            <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
              Explorez les récits et traditions partagés par des contributeurs du monde entier.
            </p>
            <div className="stories-section">
              {STORIES.map((story) => (
                <div key={story.id} className="story-card">
                  <div className="story-icon">📚</div>
                  <div className="story-content">
                    <h3>{story.title}</h3>
                    <div className="story-author">Par {story.author} ({story.country})</div>
                    <p style={{ marginTop: "8px", color: "#cbd5e1" }}>
                      Cliquez pour découvrir l'histoire complète...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* COUNTRIES */}
        {activeTab === "countries" && (
          <section>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>Carte des Cultures</h2>
            <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
              Explorez les cultures et artistes par pays.
            </p>
            <div className="countries-section">
              {COUNTRIES.map((country) => (
                <div key={country.code} className="country-card">
                  <div className="country-flag">🌍</div>
                  <div className="country-name">{country.name}</div>
                  <div className="country-stats">
                    {country.cultures} cultures<br/>
                    {country.artists} artistes
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SALON */}
        {activeTab === "salon" && (
          <section>
            <div className="salon-section">
              <div className="salon-header">💬 Salon Public — Discutez Culture</div>
              <p style={{ color: "#cbd5e1", marginBottom: "16px" }}>
                Un espace gratuit pour tous. Discutez, posez des questions, partagez vos découvertes.
              </p>
              <div className="messages">
                <div className="message">
                  <div className="message-author">👤 Sophie Dupont</div>
                  <div className="message-text">Comment fabrique-t-on les masques Fang ?</div>
                </div>
                <div className="message">
                  <div className="message-author">👤 Kofi Mensah</div>
                  <div className="message-text">C'est une technique ancestrale du Gabon, très complexe...</div>
                </div>
                <div className="message">
                  <div className="message-author">👤 Amara Diallo</div>
                  <div className="message-text">Les traditions du Sénégal sont magnifiques, j'en suis fier!</div>
                </div>
              </div>
              {isLoggedIn ? (
                <div className="input-group">
                  <input type="text" placeholder="Votre message (gratuit)..." />
                  <button>Envoyer</button>
                </div>
              ) : (
                <p style={{ color: "#fbbf24", textAlign: "center" }}>
                  Connectez-vous pour participer au salon.
                </p>
              )}
            </div>
          </section>
        )}

        {/* VIP */}
        {activeTab === "vip" && (
          <section>
            <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>👑 Accès VIP — Cercle Culturel Premium</h2>
            <p style={{ color: "#cbd5e1", marginBottom: "24px" }}>
              Entrez dans un cercle exclusif. Archives sacrées, interviews privées, expériences immersives.
            </p>
            <div className="vip-section">
              {VIP_CONTENT.map((item) => (
                <div key={item.id} className="vip-card" onClick={() => handleVipClick(item)}>
                  <div className="vip-icon">🔐</div>
                  <div className="vip-title">{item.title}</div>
                  <div className="vip-description">{item.description}</div>
                  <div className="vip-price">{item.price} {item.currency}</div>
                  <button className="btn-vip" onClick={() => handleVipClick(item)}>
                    {hasVIP ? "Accéder" : "Débloquer"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* VIP PAYWALL MODAL */}
      {vipModal && selectedVipItem && (
        <div className="modal-overlay" onClick={() => setVipModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🔐</div>
            <div className="modal-title">{selectedVipItem.title}</div>
            <div className="modal-desc">
              {selectedVipItem.description}
              <br /><br />
              <strong>Accès complet :</strong> {selectedVipItem.price} {selectedVipItem.currency}
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setVipModal(false)}>
                Annuler
              </button>
              <button className="btn-pay" onClick={() => handleVipPurchase(selectedVipItem)}>
                Payer maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const btnStyleAlt = { background: "#16c784", border: "none", color: "#fff", padding: "8px 12px", borderRadius: 6, cursor: "pointer" };
// ...existing code...
async function handlePurchasePi(id) {
  // crée une "invoice" côté backend
  const res = await fetch(`/api/create-pi-invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId: id, amount: 5 }) // montant en Pi (ou unité convenue)
  });
  const invoice = await res.json();
  // invoice: { invoiceId, address, memo, amount }
  // afficher modal simple avec adresse + QR + champ tx
  const tx = prompt(`Envoyer ${invoice.amount} Pi à ${invoice.address}\nMemo: ${invoice.memo}\n\nAprès envoi, colle l'ID de transaction (tx) ici pour vérification :`);
  if (tx) {
    await fetch("/api/submit-pi-tx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId: invoice.invoiceId, tx })
    });
    alert("Tx soumise. Validation en cours (admin/automation).");
  }
}
// ...existing code...