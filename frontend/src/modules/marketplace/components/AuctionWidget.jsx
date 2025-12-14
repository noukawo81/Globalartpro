import React, { useState, useEffect } from "react";

/**
 * AuctionWidget Component
 * 
 * Affiche les détails d'une enchère active avec:
 * - Timeline countdown
 * - Historique des enchères
 * - Formulaire de mise
 * - Support multi-devise (ARTC, π, EUR)
 */
export default function AuctionWidget({
  auctionId = "AUC-2025-02-001",
  startPrice = 500,
  currentBid = 750,
  endDate = "2025-02-28T23:59:59Z",
  paymentMethods = ["ARTC", "π", "EUR"],
  bids = [
    { bidder: "user123", amount: 750, timestamp: "2025-01-20T14:30:00Z" },
    { bidder: "user456", amount: 650, timestamp: "2025-01-20T13:15:00Z" },
  ],
  onPlaceBid = () => {},
}) {
  const [timeLeft, setTimeLeft] = useState("");
  const [bidAmount, setBidAmount] = useState(currentBid + 50);
  const [selectedCurrency, setSelectedCurrency] = useState(paymentMethods[0]);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Enchère terminée");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft(`${days}j ${hours}h ${mins}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const handlePlaceBid = () => {
    if (bidAmount <= currentBid) {
      alert(`L'enchère doit être supérieure à ${currentBid} ${selectedCurrency}`);
      return;
    }

    setIsPlacingBid(true);
    setTimeout(() => {
      onPlaceBid({
        auctionId,
        amount: bidAmount,
        currency: selectedCurrency,
        timestamp: new Date().toISOString(),
      });
      alert(`Enchère de ${bidAmount} ${selectedCurrency} placée !`);
      setIsPlacingBid(false);
    }, 500);
  };

  return (
    <div className="auction-widget">
      <h3>🏆 Enchère Active</h3>

      {/* COUNTDOWN */}
      <div className="auction-timer">
        <span className="label">Temps restant:</span>
        <span className="countdown">{timeLeft}</span>
      </div>

      {/* CURRENT BID */}
      <div className="auction-current">
        <span className="label">Enchère courante:</span>
        <span className="current-bid">
          {currentBid} {selectedCurrency}
        </span>
        <span className="min-next-bid">
          (min. {currentBid + 50} {selectedCurrency})
        </span>
      </div>

      {/* BID FORM */}
      <div className="auction-form">
        <label>Votre enchère:</label>
        <div className="bid-input-group">
          <input
            type="number"
            min={currentBid + 50}
            step="10"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            placeholder="Montant"
            className="bid-input"
          />
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="currency-select"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handlePlaceBid}
          disabled={isPlacingBid}
          className="btn-place-bid"
        >
          {isPlacingBid ? "Traitement..." : "🔨 Placer l'enchère"}
        </button>
      </div>

      {/* BID HISTORY */}
      <div className="auction-history">
        <h4>Historique des enchères</h4>
        <div className="bids-list">
          {bids && bids.length > 0 ? (
            bids
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 5)
              .map((bid, idx) => (
                <div key={idx} className="bid-row">
                  <span className="bid-rank">#{idx + 1}</span>
                  <span className="bid-user">{bid.bidder.slice(0, 8)}...</span>
                  <span className="bid-amount">
                    {bid.amount} {selectedCurrency}
                  </span>
                  <span className="bid-time">
                    {new Date(bid.timestamp).toLocaleTimeString("fr-FR")}
                  </span>
                </div>
              ))
          ) : (
            <p className="no-bids">Aucune enchère pour le moment</p>
          )}
        </div>
      </div>

      {/* AUCTION INFO */}
      <div className="auction-info">
        <p>
          <strong>ID Enchère:</strong> {auctionId}
        </p>
        <p>
          <strong>Commission:</strong> 8% (GlobalArtPro)
        </p>
        <p className="terms">
          ✓ Paiement sécurisé | ✓ Contrat intelligent | ✓ Certificat d'authenticité
        </p>
      </div>
    </div>
  );
}
