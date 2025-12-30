import React, { useEffect, useState } from "react";
import { useAuth } from '@/core/hooks/useAuth.js';
import { api } from '@/services/api.js';
import { Link } from "react-router-dom";
import "./marketplace.css";

const MOCK_DATA = {
  physical: [
    {
      id: "p1",
      title: "Masque traditionnel Baoulé",
      artist: "Kofi Mensah",
      price: 520,
      currency: "EUR",
      images: ["/assets/marketplace/art_mask.jpg"],
      video360: "/assets/videos/mask_360.mp4",
      description: "Authentique masque baoulé du XIXe siècle, bois de rose, patine naturelle.",
      history: "Ce masque était porté lors des rituels de fertilité. Provenance confirmée du village de Yamoussoukro.",
      materials: "Bois de rose, pigments naturels",
      dimensions: "45cm x 30cm",
      certified: true,
      certNumber: "GAP-2025-PHY-001",
      certDate: "15 janvier 2025",
      shipping: "Emballage sécurisé + assurance incluse",
      returns: "Retour possible sous 30 jours",
      artisanGrade: "Gold",
      views: 1240,
      favorites: 87,
      provenance: "Côte d'Ivoire",
    },
    {
      id: "p2",
      title: "Sculpture africaine — L'esprit de la forêt",
      artist: "Aminata Diop",
      price: 890,
      currency: "EUR",
      images: ["/assets/marketplace/sculpture.jpg"],
      description: "Sculpture en bois représentant les esprits forestiers.",
      history: "Inspirée par la mythologie sénégalaise, cette œuvre raconte l'histoire des ancêtres.",
      materials: "Bois de teck",
      dimensions: "120cm hauteur",
      certified: true,
      certNumber: "GAP-2025-PHY-002",
      certDate: "10 janvier 2025",
      shipping: "Transport assuré par partenaire",
      returns: "Non retournable (art ancien)",
      artisanGrade: "Elite",
      views: 2150,
      favorites: 156,
      provenance: "Sénégal",
    },
    {
      id: "p3",
      title: "Photographie — Rituel du matin",
      artist: "Pierre Ndombele",
      price: 180,
      currency: "EUR",
      images: ["/assets/marketplace/photo.jpg"],
      description: "Photographie noir et blanc, édition limitée 1/25.",
      certified: false,
      artisanGrade: "Silver",
      views: 540,
      favorites: 42,
      provenance: "Cameroun",
    },
  ],
  digital: [
    {
      id: "d1",
      title: "Illustration numérique — Danse du vent",
      artist: "Zainab Ahmed",
      price: 85,
      currency: "EUR",
      images: ["/assets/marketplace/digital_art_1.jpg"],
      description: "Illustration digitale haute résolution 4K.",
      formats: ["JPG", "PNG", "TIFF", "PSD"],
      license: "personnel",
      licensed: true,
      versions: ["v1.0 (initiale)", "v2.0 (améliorée)"],
      watermark: true,
      certified: true,
      certNumber: "GAP-2025-DIG-001",
      certDate: "12 janvier 2025",
      artisanGrade: "Silver",
      views: 3450,
      favorites: 312,
    },
    {
      id: "d2",
      title: "Art génératif — Emergence culturelle",
      artist: "Okafor Chinedu",
      price: 120,
      currency: "EUR",
      images: ["/assets/marketplace/digital_art_gen.jpg"],
      description: "Algorithme génératif inspiré par les patterns textiles yoruba.",
      formats: ["SVG", "PNG"],
      license: "commercial",
      certified: true,
      certNumber: "GAP-2025-DIG-002",
      certDate: "8 janvier 2025",
      artisanGrade: "Gold",
      views: 5600,
      favorites: 487,
    },
  ],
  nft: [
    {
      id: "n1",
      title: "NFT — Esprit du Cameroun",
      artist: "Marie Yamaha",
      price: 50,
      currency: "ARTC",
      images: ["/assets/marketplace/nft_sample.jpg"],
      description: "NFT lié au patrimoine culturel camerounais.",
      blockchain: "ARTCoin",
      tokenId: "0x4a2f8c9d",
      smartContract: "0xabc123...",
      culturalContext: "Représente les esprits protecteurs de la montagne du Cameroun.",
      bilingualDescription: "Français + Pidgin English",
      certified: true,
      certNumber: "GAP-2025-NFT-001",
      certDate: "5 janvier 2025",
      artisanGrade: "Gold",
      resellable: true,
      views: 8920,
      favorites: 743,
      auctionActive: true,
      auctionEndDate: "2025-02-15",
    },
  ],
  museum: [
    {
      id: "m1",
      title: "Galerie Prestige — Afrique de l'Ouest",
      type: "3d-gallery",
      description: "Visite immersive des œuvres certifiées Elite.",
      continent: "Afrique",
      country: "Côte d'Ivoire",
      certified: true,
      virtualGuide: true,
      artCount: 45,
    },
  ],
};

export default function MarketplaceHome() {
  const [activeTab, setActiveTab] = useState("physical");
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("popularity");
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);
  const [paymentToken, setPaymentToken] = useState('PI');
  const [showPIModal, setShowPIModal] = useState(false);
  const [piPaymentAddress] = useState(import.meta.env.VITE_PI_APP_WALLET || 'pi-wallet-demo-001');

  // Authenticated user (use central auth context)
  const { user: authUser } = useAuth();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.getMarketplaceListings(true);
        const listings = (res && res.listings) || [];
        // Map listings into expected product shape (type mapping by pole)
        const data = listings.filter(l => (activeTab === 'museum' ? l.pole === 'museum' : (activeTab === 'physical' ? l.pole === 'physical' || l.pole === 'physical' : (activeTab === 'digital' ? l.pole === 'digital' : (activeTab === 'nft' ? l.pole === 'nft' : true)))))
                         .map(l => ({ id: l.id, title: l.title, artist: l.artistName || l.artistId || l.artist || 'Artiste inconnu', price: l.price, currency: l.baseCurrency || 'USD', displayPrices: l.displayPrices, raw: l }));
        if (mounted) setProducts(data.length ? data : (MOCK_DATA[activeTab] || []));
      } catch {
        // Fallback to mock data
        setProducts(MOCK_DATA[activeTab] || []);
      }
    }
    load();
    return () => { mounted = false; };
  }, [activeTab]);

  useEffect(() => {
    let data = products;
    if (search.trim()) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        p.artist?.toLowerCase().includes(search.trim().toLowerCase())
      );
    }
    if (showCertifiedOnly) {
      data = data.filter((p) => p.certified);
    }
    data = data.filter((p) => {
      const price = p.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    if (sortBy === "popularity") {
      data.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "price-asc") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      data.sort((a, b) => b.price - a.price);
    } else if (sortBy === "favorites") {
      data.sort((a, b) => (b.favorites || 0) - (a.favorites || 0));
    }
    setFiltered(data);
  }, [search, priceRange, products, sortBy, showCertifiedOnly]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  async function handleBuy(product, overrideToken) {
    try {
      const stored = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = authUser?.id || stored?.id;
      if (!userId) return alert('Connectez-vous pour acheter.');
      // Prefer sellerId if available, else fall back to artist name or marketplace-seller
      const sellerId = product.artistId || product.artist || 'marketplace-seller';
      const token = overrideToken || (product.currency === 'ARTC' ? 'ARTC' : paymentToken || 'PI');
      const res = await api.marketplaceBuy(userId, sellerId, product.id, product.price, token);
      // Accept 200/201/204 as success in E2E/stubbed runs
      if (res && (res.status === 200 || res.status === 201 || res.status === 204 || (res.data && res.data.ok))) {
        // do not show a blocking alert for 204 stubbed responses
        if (res.status === 204) {
          console.log('Buy succeeded with 204 (E2E stub)');
        } else {
          alert('Achat réussi !');
        }
        closeModal();
      } else {
        alert('Erreur lors de l’achat: ' + (res?.data?.error || res?.error || 'unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’achat');
    }
  }

  return (
    <div className="marketplace-container">
      <section className="marketplace-hero">
        <h1>� Marketplace GlobalArtPro</h1>
        <p>Explorez des œuvres authentiques : art physique, numérique, NFT et galeries 3D immersives.</p>
      </section>

      <div className="marketplace-tabs">
        {[
          { id: "physical", label: "�️ Art Physique", icon: "physical_icon" },
          { id: "digital", label: "� Art Numérique", icon: "digital_icon" },
          { id: "nft", label: "🔗 NFT Web3", icon: "nft_icon" },
          { id: "museum", label: "🏢 Musée 3D", icon: "museum_icon" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="marketplace-filters">
        <input
          type="text"
          placeholder="Rechercher une œuvre ou un artiste..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="popularity">Popularité</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="favorites">Tendance</option>
          </select>

          {activeTab !== "museum" && (
            <>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="price-slider"
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showCertifiedOnly}
                  onChange={(e) => setShowCertifiedOnly(e.target.checked)}
                />
                ✓ Certifiés uniquement
              </label>
            </>
          )}
        </div>
      </div>

      <div className="marketplace-grid">
        {filtered.length === 0 ? (
          <p className="no-results">Aucune œuvre ne correspond à votre recherche.</p>
        ) : (
          filtered.map((product) => (
            <div
              key={product.id}
              className="marketplace-card"
              onClick={() => handleProductClick(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-image">
                <img src={product.images?.[0]} alt={product.title} />
                {product.certified && (
                  <div className="certified-badge">✓ Certifié GlobalArtPro</div>
                )}
                {product.artisanGrade && (
                  <div className={`grade-badge grade-${product.artisanGrade.toLowerCase()}`}>
                    {product.artisanGrade}
                  </div>
                )}
              </div>
              <div className="card-info">
                <h3>{product.title}</h3>
                <p className="artist">par {product.artist}</p>
                <div className="card-stats">
                  <span>�️ {product.views || 0}</span>
                  <span>❤️ {product.favorites || 0}</span>
                </div>
                <p className="price">
                  {product.price} {product.currency}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className="modal-grid">
              <div className="modal-images">
                <img src={selectedProduct.images?.[0]} alt={selectedProduct.title} />
                {selectedProduct.video360 && (
                  <button className="btn-secondary">�� Voir en 360°</button>
                )}
              </div>
              <div className="modal-details">
                <h2>{selectedProduct.title}</h2>
                {selectedProduct.certified && (
                  <div className="cert-info">
                    ✓ <strong>Certifié GlobalArtPro</strong> — {selectedProduct.certNumber}
                  </div>
                )}
                <p><strong>Artiste:</strong> {selectedProduct.artist} ({selectedProduct.artisanGrade})</p>
                <p><strong>Prix:</strong> {selectedProduct.price} {selectedProduct.currency}</p>

                {activeTab === "physical" && (
                  <>
                    <p><strong>Matériaux:</strong> {selectedProduct.materials}</p>
                    <p><strong>Dimensions:</strong> {selectedProduct.dimensions}</p>
                    <p><strong>Provenance:</strong> {selectedProduct.provenance}</p>
                    <p><strong>Origine:</strong> {selectedProduct.history}</p>
                    <p><strong>Transport:</strong> {selectedProduct.shipping}</p>
                    <p><strong>Retour:</strong> {selectedProduct.returns}</p>
                  </>
                )}

                {activeTab === "digital" && (
                  <>
                    <p><strong>Formats disponibles:</strong> {selectedProduct.formats?.join(", ")}</p>
                    <p><strong>Licence:</strong> {selectedProduct.license === "personnel" ? "Personnel" : "Commercial"}</p>
                    <p><strong>Versions:</strong> {selectedProduct.versions?.join(" → ")}</p>
                  </>
                )}

                {activeTab === "nft" && (
                  <>
                    <p><strong>Blockchain:</strong> {selectedProduct.blockchain}</p>
                    <p><strong>Token ID:</strong> {selectedProduct.tokenId}</p>
                    <p><strong>Contexte culturel:</strong> {selectedProduct.culturalContext}</p>
                    <p><strong>Revente:</strong> {selectedProduct.resellable ? "Autorisée" : "Non autorisée"}</p>
                    {selectedProduct.auctionActive && (
                      <p><strong>Enchère active jusqu'au:</strong> {selectedProduct.auctionEndDate}</p>
                    )}
                  </>
                )}

                <p className="description">{selectedProduct.description}</p>
                <div className="modal-actions">
                  <label style={{ marginRight: 8 }}>
                    Afficher les prix en:
                    <select value={paymentToken} onChange={(e) => setPaymentToken(e.target.value)} style={{ marginLeft: 8 }}>
                      <option value="PI">Pi</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="CNY">CNY</option>
                      <option value="RUB">RUB</option>
                      <option value="GOLD">Or</option>
                    </select>
                  </label>
                  <div style={{ marginLeft: 12, marginRight: 12 }}>
                    {selectedProduct.displayPrices ? (
                      <small>
                        {Object.entries(selectedProduct.displayPrices).map(([k,v]) => (`${k}: ${v} `))}
                      </small>
                    ) : null}
                  </div>
                  {paymentToken === 'PI' ? (
                    <button className="btn-primary" onClick={() => setShowPIModal(true)}>Payer en Pi (QR)</button>
                  ) : (
                    <button className="btn-primary" onClick={() => handleBuy(selectedProduct, paymentToken)}>Acheter maintenant</button>
                  )}
                  <button className="btn-secondary">❤️ Ajouter aux favoris</button>
                  {activeTab === "nft" && <button className="btn-secondary">� Voir les enchères</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="artist-cta">
        <h3>Es-tu un artiste ?</h3>
        <p>Rejoins GlobalArtPro et partage tes créations avec le monde. Deviens certifié et accède aux enchères mondiales.</p>
        <Link to="/artists" className="btn-primary">Créer mon profil artiste</Link>
      </section>

      {showPIModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowPIModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPIModal(false)}>✕</button>
            <h3>Paiement en Pi</h3>
            <p>Scannez le QR ci-dessous avec votre portefeuille Pi pour payer <strong>{selectedProduct.displayPrices?.PI || '—'} PI</strong></p>
            <img alt="PI QR" src={`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(`pi:${piPaymentAddress}?amount=${selectedProduct.displayPrices?.PI || ''}`)}`} />
            <p style={{ marginTop: 12 }}>Adresse: <code>{piPaymentAddress}</code></p>
            <div style={{ marginTop: 12 }}>
              <button className="btn-primary" onClick={async () => {
                // For demo, assume user paid and call buy backend with token PI
                try {
                  await handleBuy(selectedProduct, 'PI');
                  setShowPIModal(false);
                } catch {
                  alert('Erreur lors du paiement PI');
                }
              }}>J'ai payé — Confirmer</button>
              <button className="btn-secondary" onClick={() => setShowPIModal(false)} style={{ marginLeft: 8 }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
