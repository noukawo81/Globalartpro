import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '@/services/api.js';
import { useAuth } from "@/core/hooks/useAuth.js";

export default function ArtistList() {
  const [tab, setTab] = useState("signup");
  const navigate = useNavigate();
  const { login, setArtistId } = useAuth();

  // Signup controlled form
  const [signup, setSignup] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    bio: "",
    domain: "",
    styles: "",
    avatar: "",
    portfolio: "",
  });

  // Login controlled form
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");



  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    // basic validation
    if (!signup.email || !signup.password || !signup.firstName) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    // Register via backend (no local fallback)
    api.register(`${signup.firstName} ${signup.lastName}`.trim(), signup.email, signup.password, 'artist')
      .then((res) => {
        const serverUser = res && (res.user || res) || null;
        const serverToken = res?.token || null;
        if (serverUser && serverUser.id && serverToken) {
          api.setToken(serverToken);
          try { localStorage.setItem('ga_token', serverToken); } catch (e) { console.error(e); }
          try { localStorage.setItem('artistId', serverUser.id); } catch (e) { console.error(e); }
          try { localStorage.setItem('currentUser', JSON.stringify(serverUser)); } catch (e) { console.error(e); }
          try { setArtistId(String(serverUser.id)); } catch (e) { console.error(e); }
          login({ user: serverUser, token: serverToken });
          navigate(`/artist/${serverUser.id}`);
        } else {
          setError('Inscription échouée : réponse serveur invalide.');
        }
      })
      .catch(() => {
        setError('Inscription échouée : impossible de contacter le serveur.');
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    // No local fallback by default; try backend login first
    try {
      const res = await api.login(loginForm.email, loginForm.password);
      const serverUser = res.user || res;
      // Upsert into local artists list so profile pages work locally
      try {
        const list = JSON.parse(localStorage.getItem('artists') || '[]');
        const idx = list.findIndex((a) => String(a.id) === String(serverUser.id));
        const obj = { id: serverUser.id, name: serverUser.name || serverUser.email, email: serverUser.email };
        if (idx >= 0) list[idx] = { ...list[idx], ...obj }; else list.push(obj);
        localStorage.setItem('artists', JSON.stringify(list));
      } catch (e) { console.error(e); }
      // Persist token & artistId before updating auth context to avoid race
      api.setToken(res.token);
      localStorage.setItem('artistId', serverUser.id);
      try { setArtistId(String(serverUser.id)); } catch (e) { console.error(e); }
      localStorage.setItem('ga_token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(serverUser));
      login(res);
      navigate(`/artist/${serverUser.id}`);
      return;
    } catch (err) {
      // If no response (network error), offer offline/dev fallback
      if (!err || !err.response) {
        setError("Impossible de contacter le serveur backend. Démarrez-le (`cd backend && npm run dev`) ou utilisez le mode démo ci-dessous.");
      } else {
        setError('Email ou mot de passe incorrect.');
      }
      return;
    }
  };

  // Dev/offline login helper (useful lorsque le backend est indisponible)
  const mockLogin = () => {
    const id = `dev-user-${Date.now()}`;
    const user = { id, name: 'Mode Démo', email: loginForm.email || 'dev@example.com', role: 'artist' };
    const token = `mock-${Date.now()}`;
    try { api.setToken(token); } catch (e) { console.error(e); }
    try { localStorage.setItem('ga_token', token); } catch (e) { console.error(e); }
    try { localStorage.setItem('currentUser', JSON.stringify(user)); } catch (e) { console.error(e); }
    try { localStorage.setItem('artistId', id); } catch (e) { console.error(e); }
    try { setArtistId(String(id)); } catch (e) { console.error(e); }
    // Upsert into local artists list
    try {
      const list = JSON.parse(localStorage.getItem('artists') || '[]');
      const idx = list.findIndex((a) => String(a.id) === String(id));
      const obj = { id, name: user.name, email: user.email };
      if (idx >= 0) list[idx] = { ...list[idx], ...obj }; else list.push(obj);
      localStorage.setItem('artists', JSON.stringify(list));
    } catch (e) { console.error(e); }
    login({ user, token });
    navigate(`/artist/${id}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h2 style={styles.title}>Espace Artiste – GlobalArtPro</h2>

        {/* Onglets */}
        <div style={styles.tabs}>
          <button
            style={tab === "signup" ? styles.activeTab : styles.tab}
            onClick={() => {
              setTab("signup");
              setError("");
            }}
          >
            S’inscrire
          </button>

          <button
            style={tab === "login" ? styles.activeTab : styles.tab}
            onClick={() => {
              setTab("login");
              setError("");
            }}
          >
            Se connecter
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* FORMULAIRE D'INSCRIPTION */}
        {tab === "signup" && (
          <form style={styles.form} onSubmit={handleSignup}>

            <label>Nom</label>
            <input
              type="text"
              required
              style={styles.input}
              value={signup.lastName}
              onChange={(e) => setSignup({ ...signup, lastName: e.target.value })}
            />

            <label>Prénom</label>
            <input
              type="text"
              required
              style={styles.input}
              value={signup.firstName}
              onChange={(e) => setSignup({ ...signup, firstName: e.target.value })}
            />

            <label>Email</label>
            <input
              type="email"
              required
              style={styles.input}
              value={signup.email}
              onChange={(e) => setSignup({ ...signup, email: e.target.value })}
            />

            <label>Mot de passe</label>
            <input
              type="password"
              required
              style={styles.input}
              value={signup.password}
              onChange={(e) => setSignup({ ...signup, password: e.target.value })}
            />

            <label>Bio (optionnel)</label>
            <textarea
              style={styles.textarea}
              value={signup.bio}
              onChange={(e) => setSignup({ ...signup, bio: e.target.value })}
            />

            <label>Domaine artistique</label>
            <select
              required
              style={styles.input}
              value={signup.domain}
              onChange={(e) => setSignup({ ...signup, domain: e.target.value })}
            >
              <option value="">Choisir...</option>
              <option value="peinture">Peinture & Arts visuels</option>
              <option value="musique">Musique</option>
              <option value="sculpture">Sculpture</option>
              <option value="photographie">Photographie</option>
              <option value="mode">Mode & Design textile</option>
              <option value="danse">Danse & Performance</option>
              <option value="cinema">Cinéma & Vidéo</option>
              <option value="litterature">Littérature</option>
              <option value="digital">Art numérique</option>
              <option value="architecture">Architecture & Design</option>
            </select>

            <label>Styles / mots-clés (séparés par des virgules)</label>
            <input
              type="text"
              placeholder="ex: surréalisme, abstrait"
              style={styles.input}
              value={signup.styles}
              onChange={(e) => setSignup({ ...signup, styles: e.target.value })}
            />

            <label>Avatar (URL)</label>
            <input
              type="url"
              placeholder="https://..."
              style={styles.input}
              value={signup.avatar}
              onChange={(e) => setSignup({ ...signup, avatar: e.target.value })}
            />

            <label>Portfolio / Œuvre (URL)</label>
            <input
              type="url"
              placeholder="https://..."
              style={styles.input}
              value={signup.portfolio}
              onChange={(e) => setSignup({ ...signup, portfolio: e.target.value })}
            />

            <button type="submit" style={styles.button}>
              Créer mon compte
            </button>
          </form>
        )}

        {/* FORMULAIRE DE CONNEXION */}
        {tab === "login" && (
          <form style={styles.form} onSubmit={handleLogin}>

            <label>Email</label>
            <input
              type="email"
              required
              style={styles.input}
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />

            <label>Mot de passe</label>
            <input
              type="password"
              required
              style={styles.input}
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />

            <button type="submit" style={styles.button}>
              Connexion
            </button>
            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={mockLogin} style={{ ...styles.button, background: '#374151', color: '#fff' }}>Mode démo (hors-ligne)</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

/* ---------------- STYLE REACT PRO ---------------- */
const styles = {
  page: {
    background: "#111",
    minHeight: "100vh",
    padding: "2em",
    color: "#eee",
  },
  container: {
    maxWidth: "420px",
    margin: "auto",
    background: "#1b1b1b",
    padding: "1.5em",
    borderRadius: "12px",
    boxShadow: "0 0 12px #0007",
  },
  title: {
    textAlign: "center",
    color: "gold",
    marginBottom: "1em",
  },
  tabs: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.5em",
  },
  tab: {
    width: "48%",
    padding: "0.8em",
    background: "#333",
    border: "none",
    color: "gold",
    borderRadius: "6px",
    cursor: "pointer",
  },
  activeTab: {
    width: "48%",
    padding: "0.8em",
    background: "gold",
    border: "none",
    color: "#111",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
  },
  form: {},
  input: {
    width: "100%",
    padding: "0.8em",
    marginTop: "0.3em",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#222",
    color: "#eee",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "0.8em",
    marginTop: "0.3em",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#222",
    color: "#eee",
  },
  button: {
    width: "100%",
    marginTop: "1.5em",
    padding: "0.9em",
    background: "linear-gradient(90deg, #6a11cb, #ffd700)",
    border: "none",
    borderRadius: "8px",
    color: "#111",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
  },
};