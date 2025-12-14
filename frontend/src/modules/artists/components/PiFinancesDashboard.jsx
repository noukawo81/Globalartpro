import React, { useState } from "react";

/**
 * Composant de gestion financière Pi Coin
 * Affiche le solde, les gains, les transactions et permet les retraits
 */
export default function PiFinancesDashboard() {
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const artistData = {
    balance: 3456.75,
    totalEarnings: 12450,
    pendingPayments: 234.5,
    walletAddress: "pi_1a2b3c4d5e6f7g8h9i0j",
    lastWithdrawal: "2025-12-05",
    withdrawalLimit: 10000,
  };

  // Transactions (ventes, retraits, etc.)
  const transactions = [
    {
      id: 1,
      type: "sale",
      description: "Vente: La Renaissance",
      amount: 125.5,
      date: "2025-12-10",
      status: "completed",
    },
    {
      id: 2,
      type: "sale",
      description: "Vente: Le Silence",
      amount: 89.0,
      date: "2025-12-08",
      status: "completed",
    },
    {
      id: 3,
      type: "withdrawal",
      description: "Retrait vers wallet",
      amount: -500,
      date: "2025-12-05",
      status: "completed",
    },
    {
      id: 4,
      type: "sale",
      description: "Vente: Mémoire Ancienne",
      amount: 234.75,
      date: "2025-12-03",
      status: "completed",
    },
    {
      id: 5,
      type: "pending",
      description: "Vente en attente: NFT Édition",
      amount: 234.5,
      date: "2025-12-10",
      status: "pending",
    },
  ];

  // Gains par catégorie
  const earningsByCategory = [
    { category: "Ventes d'art", amount: 8450, percentage: 67.8 },
    { category: "NFT Minting", amount: 2100, percentage: 16.9 },
    { category: "Collaborations", amount: 1200, percentage: 9.6 },
    { category: "Tippage", amount: 700, percentage: 5.6 },
  ];

  const handleWithdraw = (e) => {
    e.preventDefault();
    alert(`✅ Retrait de ${withdrawAmount}π demandé!\nArrival estimé: 1-3 jours.`);
    setWithdrawAmount("");
    setShowWithdrawForm(false);
  };

  return (
    <div style={styles.container}>
      {/* HEADER - SOLDE PRINCIPAL */}
      <div style={styles.header}>
        <div style={styles.balanceCard}>
          <p style={styles.balanceLabel}>💎 Solde actuel</p>
          <p style={styles.balanceAmount}>{artistData.balance.toFixed(2)} π</p>
          <p style={styles.balanceEur}>≈ {(artistData.balance * 0.36).toFixed(2)} EUR</p>
        </div>

        <div style={styles.statsRow}>
          <StatBox
            icon="📈"
            label="Gains totaux"
            value={`${artistData.totalEarnings}π`}
            color="#4ECDC4"
          />
          <StatBox
            icon="⏳"
            label="En attente"
            value={`${artistData.pendingPayments}π`}
            color="#FFE66D"
          />
          <StatBox
            icon="📊"
            label="Taux de conversion"
            value="1π = 0.36€"
            color="#FF6B6B"
          />
        </div>
      </div>

      {/* BOUTON RETRAIT */}
      <button
        onClick={() => setShowWithdrawForm(!showWithdrawForm)}
        style={styles.withdrawButton}
      >
        🏦 Demander un retrait
      </button>

      {/* FORMULAIRE RETRAIT */}
      {showWithdrawForm && (
        <div style={styles.withdrawForm}>
          <h3 style={{ marginTop: 0 }}>Retrait vers votre Wallet</h3>

          <div style={styles.formGroup}>
            <label>Adresse du wallet Pi</label>
            <input
              type="text"
              defaultValue={artistData.walletAddress}
              readOnly
              style={styles.formInput}
            />
            <button style={styles.copyButton} onClick={() => {
              navigator.clipboard.writeText(artistData.walletAddress);
              alert("✅ Copié dans le presse-papiers!");
            }}>
              📋 Copier
            </button>
          </div>

          <div style={styles.formGroup}>
            <label>Montant à retirer (π)</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Ex: 100"
              min="10"
              max={Math.min(artistData.balance, artistData.withdrawalLimit)}
              style={styles.formInput}
            />
            <small style={{ opacity: 0.7 }}>
              Limite actuelle: {artistData.withdrawalLimit}π | Solde: {artistData.balance}π
            </small>
          </div>

          <div style={styles.formGroup}>
            <label>Frais de traitement</label>
            <div style={styles.feesInfo}>
              <p>Montant: {withdrawAmount || 0}π</p>
              <p style={{ color: "#FF6B6B" }}>Frais (2%): {((withdrawAmount || 0) * 0.02).toFixed(2)}π</p>
              <p style={{ color: "#ffd700", fontWeight: "bold", fontSize: "1.1em" }}>
                Total reçu: {((withdrawAmount || 0) * 0.98).toFixed(2)}π
              </p>
            </div>
          </div>

          <div style={styles.formGroup}>
            <p style={{ fontSize: "0.9em", opacity: 0.7 }}>
              ℹ️ Les retraits sont traités en 1-3 jours ouvrables.
            </p>
          </div>

          <div style={styles.formButtons}>
            <button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || withdrawAmount <= 0}
              style={{
                ...styles.submitButton,
                opacity: !withdrawAmount || withdrawAmount <= 0 ? 0.5 : 1,
              }}
            >
              ✅ Confirmer le retrait
            </button>
            <button
              onClick={() => setShowWithdrawForm(false)}
              style={styles.cancelButton}
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}

      {/* GAINS PAR CATÉGORIE */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Gains par catégorie</h3>
        <div style={styles.earningsGrid}>
          {earningsByCategory.map((item, idx) => (
            <div key={idx} style={styles.earningCard}>
              <p style={styles.earningCategory}>{item.category}</p>
              <p style={styles.earningAmount}>{item.amount}π</p>
              <div style={styles.earningBar}>
                <div
                  style={{
                    ...styles.earningBarFill,
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
              <p style={styles.earningPercentage}>{item.percentage}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSACTIONS RÉCENTES */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💳 Transactions récentes</h3>
        <div style={styles.transactionsList}>
          {transactions.map((tx) => (
            <div key={tx.id} style={styles.transactionItem}>
              <div style={styles.txIcon}>
                {tx.type === "sale"
                  ? "📈"
                  : tx.type === "withdrawal"
                  ? "🏦"
                  : "⏳"}
              </div>

              <div style={styles.txDetails}>
                <p style={styles.txDescription}>{tx.description}</p>
                <p style={styles.txDate}>
                  {new Date(tx.date).toLocaleDateString("fr-FR")}
                </p>
              </div>

              <div style={styles.txStatus}>
                {tx.status === "completed" ? (
                  <span style={styles.statusBadgeCompleted}>✅ Complété</span>
                ) : (
                  <span style={styles.statusBadgePending}>⏳ En attente</span>
                )}
              </div>

              <p
                style={{
                  ...styles.txAmount,
                  color: tx.amount > 0 ? "#4ECDC4" : "#FF6B6B",
                }}
              >
                {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}π
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORIQUE RETRAITS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📋 Historique des retraits</h3>
        <div style={styles.withdrawalHistory}>
          <div style={styles.withdrawalItem}>
            <span>Dernier retrait</span>
            <span>{artistData.lastWithdrawal}</span>
            <span style={{ color: "#4ECDC4" }}>500π</span>
          </div>
          <div style={styles.withdrawalItem}>
            <span>Fréquence</span>
            <span>Tous les 30 jours</span>
            <span style={{ color: "#FFE66D" }}>Flexible</span>
          </div>
          <div style={styles.withdrawalItem}>
            <span>Limite actuelle</span>
            <span>{artistData.withdrawalLimit}π / mois</span>
            <span style={{ color: "#6a11cb" }}>📈 Augmente avec vos gains</span>
          </div>
        </div>
      </div>

      {/* TAUX DE CHANGE EN DIRECT */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💱 Taux de change en direct</h3>
        <div style={styles.exchangeRates}>
          <ExchangeCard pair="π / EUR" rate="0.36" change="+2.3%" color="#4ECDC4" />
          <ExchangeCard pair="π / USD" rate="0.40" change="+1.8%" color="#FFE66D" />
          <ExchangeCard pair="π / XOF" rate="222.5" change="+0.5%" color="#FF6B6B" />
        </div>
      </div>

      {/* CONSEILS FINANCIERS */}
      <div style={styles.tipsSection}>
        <h3 style={styles.sectionTitle}>💡 Conseils pour maximiser vos revenus</h3>
        <div style={styles.tipsList}>
          <TipItem
            icon="🎨"
            title="Diversifiez vos contenus"
            description="Offrez plusieurs formats (NFT, prints, collaborations)"
          />
          <TipItem
            icon="📢"
            title="Promouvoir vos œuvres"
            description="Utilisez la Culture Map pour atteindre plus d'audience"
          />
          <TipItem
            icon="🤝"
            title="Collaborez"
            description="Les collaborations augmentent les ventes de 35% en moyenne"
          />
          <TipItem
            icon="🔔"
            title="Restez actif"
            description="Les artistes actifs ont 50% plus de ventes"
          />
        </div>
      </div>
    </div>
  );
}

/* ========== COMPOSANTS HELPERS ========== */

function StatBox({ icon, label, value, color }) {
  return (
    <div style={{ ...styles.statBox, borderLeftColor: color }}>
      <p style={styles.statLabel}>{icon} {label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function ExchangeCard({ pair, rate, change, color }) {
  return (
    <div style={{ ...styles.exchangeCard, borderTopColor: color }}>
      <p style={styles.exchangePair}>{pair}</p>
      <p style={styles.exchangeRate}>{rate}</p>
      <p style={{ color: "#4ECDC4", fontSize: "0.9em" }}>
        {change}
      </p>
    </div>
  );
}

function TipItem({ icon, title, description }) {
  return (
    <div style={styles.tipCard}>
      <span style={styles.tipIcon}>{icon}</span>
      <div>
        <h4 style={styles.tipTitle}>{title}</h4>
        <p style={styles.tipDescription}>{description}</p>
      </div>
    </div>
  );
}

/* ==================== STYLES ==================== */
const styles = {
  container: {
    padding: "0",
  },

  header: {
    marginBottom: "2em",
  },

  balanceCard: {
    background: "linear-gradient(135deg, #6a11cb 0%, #ffd700 100%)",
    borderRadius: "16px",
    padding: "2.5em",
    textAlign: "center",
    marginBottom: "2em",
    boxShadow: "0 8px 32px rgba(106, 17, 203, 0.3)",
  },

  balanceLabel: {
    fontSize: "1em",
    opacity: 0.9,
    margin: "0 0 0.5em 0",
    color: "#000",
  },

  balanceAmount: {
    fontSize: "3em",
    fontWeight: "bold",
    margin: "0 0 0.3em 0",
    color: "#000",
  },

  balanceEur: {
    fontSize: "1.1em",
    opacity: 0.8,
    margin: 0,
    color: "#000",
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },

  statBox: {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderLeftWidth: "4px",
    borderRadius: "12px",
    padding: "1.5em",
  },

  statLabel: {
    fontSize: "0.9em",
    opacity: 0.7,
    margin: "0 0 0.5em 0",
  },

  statValue: {
    fontSize: "1.8em",
    fontWeight: "bold",
    color: "#ffd700",
    margin: 0,
  },

  withdrawButton: {
    width: "100%",
    padding: "1em",
    background: "linear-gradient(90deg, #6a11cb, #ffd700)",
    border: "none",
    borderRadius: "12px",
    color: "#000",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "2em",
    transition: "all 0.3s ease",
  },

  withdrawForm: {
    background: "rgba(0,0,0,0.4)",
    border: "2px solid #ffd700",
    borderRadius: "12px",
    padding: "2em",
    marginBottom: "2em",
    backdropFilter: "blur(10px)",
  },

  formGroup: {
    marginBottom: "1.5em",
  },

  formInput: {
    width: "100%",
    padding: "0.8em",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,215,0,0.3)",
    borderRadius: "8px",
    color: "#eee",
    fontSize: "1em",
    marginTop: "0.5em",
    boxSizing: "border-box",
  },

  copyButton: {
    marginTop: "0.5em",
    padding: "0.6em 1.2em",
    background: "rgba(255,215,0,0.2)",
    border: "1px solid #ffd700",
    color: "#ffd700",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9em",
  },

  feesInfo: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,215,0,0.2)",
    borderRadius: "8px",
    padding: "1em",
    marginTop: "0.5em",
  },

  feesInfo: {
    background: "rgba(255,255,255,0.05)",
    padding: "1em",
    borderRadius: "8px",
    marginTop: "0.5em",
  },

  formButtons: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },

  submitButton: {
    padding: "0.9em",
    background: "#4ECDC4",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1em",
  },

  cancelButton: {
    padding: "0.9em",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "8px",
    color: "#eee",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1em",
  },

  section: {
    marginBottom: "2em",
    padding: "2em",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  sectionTitle: {
    fontSize: "1.3em",
    marginBottom: "1.5em",
    color: "#ffd700",
  },

  earningsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },

  earningCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "1.5em",
  },

  earningCategory: {
    fontSize: "0.95em",
    fontWeight: "bold",
    margin: "0 0 0.5em 0",
  },

  earningAmount: {
    fontSize: "1.6em",
    fontWeight: "bold",
    color: "#ffd700",
    margin: "0 0 0.8em 0",
  },

  earningBar: {
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "0.8em",
  },

  earningBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6a11cb, #ffd700)",
  },

  earningPercentage: {
    fontSize: "0.9em",
    opacity: 0.7,
    margin: 0,
  },

  transactionsList: {
    display: "grid",
    gap: "12px",
  },

  transactionItem: {
    display: "grid",
    gridTemplateColumns: "40px 1fr auto auto",
    gap: "1em",
    alignItems: "center",
    padding: "1em",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
  },

  txIcon: {
    fontSize: "1.5em",
  },

  txDetails: {
    minWidth: 0,
  },

  txDescription: {
    fontSize: "0.95em",
    fontWeight: "bold",
    margin: "0 0 0.3em 0",
  },

  txDate: {
    fontSize: "0.85em",
    opacity: 0.7,
    margin: 0,
  },

  txStatus: {},

  statusBadgeCompleted: {
    padding: "4px 12px",
    background: "rgba(78, 205, 196, 0.3)",
    color: "#4ECDC4",
    borderRadius: "20px",
    fontSize: "0.85em",
  },

  statusBadgePending: {
    padding: "4px 12px",
    background: "rgba(255, 230, 109, 0.3)",
    color: "#FFE66D",
    borderRadius: "20px",
    fontSize: "0.85em",
  },

  txAmount: {
    fontSize: "1em",
    fontWeight: "bold",
  },

  withdrawalHistory: {
    display: "grid",
    gap: "12px",
  },

  withdrawalItem: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: "1em",
    alignItems: "center",
    padding: "1em",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  exchangeRates: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },

  exchangeCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderTopWidth: "4px",
    borderRadius: "8px",
    padding: "1.5em",
    textAlign: "center",
  },

  exchangePair: {
    fontSize: "0.9em",
    opacity: 0.7,
    margin: "0 0 0.5em 0",
  },

  exchangeRate: {
    fontSize: "2em",
    fontWeight: "bold",
    color: "#ffd700",
    margin: 0,
  },

  tipsSection: {
    padding: "2em",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  tipsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },

  tipCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,215,0,0.2)",
    borderRadius: "8px",
    padding: "1.5em",
    display: "flex",
    gap: "1em",
  },

  tipIcon: {
    fontSize: "2em",
  },

  tipTitle: {
    fontSize: "1em",
    fontWeight: "bold",
    margin: "0 0 0.5em 0",
    color: "#ffd700",
  },

  tipDescription: {
    fontSize: "0.9em",
    margin: 0,
    opacity: 0.8,
  },
};
