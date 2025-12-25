import React, { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { useAuth } from '@/core/hooks/useAuth.js';
import "./MineARTC.css";

export default function MineARTC() {
  const { user: authUser } = useAuth();
  const user = authUser || JSON.parse(localStorage.getItem("currentUser") || "{}") || {};
  const userId = user?.id || null;

  // balances
  const [artcBalance, setArtcBalance] = useState(0);

  // mining state
  const [miningState, setMiningState] = useState("Inactif"); // Inactif | Actif | Terminé
  const [miningEnd, setMiningEnd] = useState(null);
  const [miningCountdown, setMiningCountdown] = useState("00:00:00");
  const [miningMessage, setMiningMessage] = useState("");
  const [claimed, setClaimed] = useState(false);
  const intervalRef = useRef(null);

  // load balance and possible existing mining session
  useEffect(() => {
    if (!userId) return;
    api.getARTCBalance(userId).then(r => setArtcBalance(r.balance || 0)).catch(() => {});

    // Prefer server status if available
    if (api.getMiningStatus) {
      api.getMiningStatus(userId).then((s) => {
        if (s && s.active && s.end) {
          setMiningEnd(s.end);
          setMiningState('Actif');
          localStorage.setItem('artc_mining_end', String(s.end));
        }
        if (s && s.claimed) setClaimed(true);
      }).catch(() => {
        const storedEnd = localStorage.getItem("artc_mining_end");
        if (storedEnd) {
          const ts = parseInt(storedEnd, 10);
          if (!isNaN(ts) && ts > Date.now()) {
            setMiningEnd(ts);
            setMiningState("Actif");
          }
        }
      });
    } else {
      const storedEnd = localStorage.getItem("artc_mining_end");
      if (storedEnd) {
        const ts = parseInt(storedEnd, 10);
        if (!isNaN(ts) && ts > Date.now()) {
          setMiningEnd(ts);
          setMiningState("Actif");
        }
      }
    }
  }, [userId]);

  // countdown updater
  useEffect(() => {
    if (!miningEnd) {
      setMiningCountdown("00:00:00");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    const update = () => {
      const diff = Math.max(0, miningEnd - Date.now());
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setMiningCountdown(`${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`);
      if (diff <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setMiningState("Terminé");
        setMiningEnd(null);
        localStorage.removeItem("artc_mining_end");
        // reward will be claimed by user via /claim (server-side validation)
        setMiningMessage("Session terminée — vous pouvez réclamer votre récompense.");
      }
    };

    update();
    if (!intervalRef.current) intervalRef.current = setInterval(update, 1000);
    return () => clearInterval(intervalRef.current);
  }, [miningEnd]);

  const startMining = async () => {
    if (!userId) return alert("Connecte-toi d'abord.");
    if (miningState === "Actif") return;
    // Ensure user is authenticated (token present)
    const token = api.getToken && api.getToken();
    if (!token) {
      alert('Vous devez être connecté pour démarrer le minage.');
      setMiningMessage('Connexion requise pour démarrer le minage.');
      return;
    }

    // Initiate mining session
    const sessionDurationMs = 24 * 60 * 60 * 1000; // 24 hours
    setMiningMessage("Démarrage en cours...");
    try {
      if (api.startMiningSession) {
        const res = await api.startMiningSession(userId, sessionDurationMs);
        if (res && res.ok && res.end) {
          setMiningEnd(res.end);
          setMiningState('Actif');
          localStorage.setItem('artc_mining_end', String(res.end));
          setMiningMessage('Session démarrée — minage en cours...');
        } else {
          // fallback to local optimistic session
          const endTs = Date.now() + sessionDurationMs;
          setMiningEnd(endTs);
          setMiningState('Actif');
          localStorage.setItem('artc_mining_end', String(endTs));
          setMiningMessage('Session démarrée localement (backend non disponible)');
        }
      } else {
        const endTs = Date.now() + sessionDurationMs;
        setMiningEnd(endTs);
        setMiningState('Actif');
        localStorage.setItem('artc_mining_end', String(endTs));
        setMiningMessage('Session démarrée localement');
      }
    } catch (err) {
      console.error('startMining error', err);
      const status = err?.response?.status;
      const serverErr = err?.response?.data?.error || err?.message;
      if (status === 401) {
        setMiningMessage('Non autorisé (401) — reconnectez-vous et réessayez.');
        alert('Erreur 401 : accès non autorisé. Veuillez vous reconnecter.');
        // clear invalid token to force re-login
        try { api.clearToken(); } catch (e) { console.error(e); }
      } else {
        setMiningMessage(serverErr || 'Impossible de démarrer la session (erreur serveur)');
        alert(serverErr || 'Impossible de démarrer la session (erreur serveur)');
      }
    }
  };

  const claimReward = async () => {
    if (!userId) return alert("Connecte-toi d'abord.");
    if (claimed) return alert("Récompense déjà réclamée.");
    try {
      const res = await api.claimMining(userId);
      if (res && res.ok) {
        setArtcBalance(res.balance || artcBalance);
        setMiningMessage(`Récompense réclamée : +${res.reward} ARTC`);
        setClaimed(true);
      } else {
        alert(res.error || 'Impossible de réclamer la récompense.');
      }
    } catch (e) {
      console.error('claim error', e);
      alert(e?.response?.data?.error || e.message || 'Erreur serveur');
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 640 }}>
      <h3>Miner ARTC (token interne)</h3>

      <div className="card artc-mining-card" style={{ background: '#0b1220', padding: 16, borderRadius: 12, color: '#e6eef8' }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="image/logo globalartpro.jpeg" alt="Logo" className="mining-logo" style={{ width: 60, height: 60, borderRadius: "50%" }} />
          <div>
            <h3 style={{ margin: 0 }}>Minage Art Coin (ARTC)</h3>
            <div className="balance-row" style={{ marginTop: 6 }}>Solde ARTC : <strong id="artcBalance" style={{ color: "#ffd700", marginLeft: 6 }}>{artcBalance}</strong></div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div>État : <strong id="miningState">{miningState}</strong></div>
          <div>Temps restant : <strong id="miningCountdown">{miningCountdown}</strong></div>
          <div style={{ marginTop: 8 }}>
            {miningState === "Inactif" && (
              <button className="btn-mine" onClick={startMining} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#047857', color:'#fff' }}>⛏️ Commencer le minage</button>
            )}
            {miningState === "Actif" && (
              <div style={{ color: '#e6eef8' }}>Temps restant: <strong>{miningCountdown}</strong></div>
            )}
            {miningState === "Terminé" && (
              <div>
                <button className="btn-mine" onClick={claimReward} disabled={claimed} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', cursor: claimed ? 'default' : 'pointer', background: claimed ? '#6b7280' : '#065f46', color:'#fff' }}>
                  {claimed ? 'Récompense réclamée' : 'Réclamer récompense'}
                </button>
              </div>
            )}
          </div>
          <div className="mining-message" style={{ marginTop: 8, color: "#ffd700" }}>{miningMessage}</div>
          <div className="mining-info" style={{ marginTop: 8, color: "#cfcfcf" }}>Chaque session dure 24 heures. Récompense : <strong id="rewardAmount">1 ARTC</strong></div>
        </div>
      </div>
    </div>
  );
}