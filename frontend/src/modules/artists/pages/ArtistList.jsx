import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from '@/services/api.js';
import { useAuth } from "@/core/hooks/useAuth.js";

export default function ArtistList() {
  const [tab, setTab] = useState("signup");
  const navigate = useNavigate();
  const { login, setArtistId, artistId } = useAuth();

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

  function saveUserToStorage(user) {
    const list = JSON.parse(localStorage.getItem("artists") || "[]");
    list.push(user);
    localStorage.setItem("artists", JSON.stringify(list));
  }

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    // basic validation
    if (!signup.email || !signup.password || !signup.firstName) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("artists") || "[]");
    if (existing.find((a) => a.email === signup.email)) {
      setError("Un compte existe déjà avec cet email.");
      return;
    }

    const id = Date.now().toString();
    const user = {
      id,
      name: `${signup.firstName} ${signup.lastName}`.trim(),
      email: signup.email,
      password: signup.password,
      bio: signup.bio,
      domain: signup.domain,
      styles: signup.styles.split(",").map((s) => s.trim()).filter(Boolean),
      avatar: signup.avatar || "https://via.placeholder.com/150",
      portfolio: signup.portfolio,
      createdAt: new Date().toISOString(),
    };

    saveUserToStorage(user);

    // Create & set mock token and persist it
    const mockToken = `mock-${id}`;
    api.setToken(mockToken);
    localStorage.setItem('ga_token', mockToken);
    localStorage.setItem("artistId", id);
    try { setArtistId(String(id)); } catch (e) {}
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Update React auth context with token (AuthContext reads token from userData)
    login({ user, token: mockToken });

    // Try to register backend user (optional, best-effort) and reconcile local id
    api.register(user.name, user.email, user.password, 'artist').then((res) => {
      // Structure: { user, token } or user object
      const serverUser = res && (res.user || res) || null;
      const serverToken = res?.token || res?.token || null;
      if (serverUser && serverUser.id) {
        // Update local artists list to use server id (replace UUID like timestamp id)
        try {
          const list = JSON.parse(localStorage.getItem('artists') || '[]');
          const idx = list.findIndex((a) => String(a.id) === String(id));
          const updatedUser = { ...list[idx], ...serverUser };
          // remove old entry by old id
          if (idx >= 0) list.splice(idx, 1);
          // push / upsert with new server id
          const existingServerIdx = list.findIndex((a) => String(a.id) === String(serverUser.id));
          if (existingServerIdx >= 0) {
            list[existingServerIdx] = { ...list[existingServerIdx], ...updatedUser };
          } else {
            list.push({ ...updatedUser, id: serverUser.id });
          }
          localStorage.setItem('artists', JSON.stringify(list));
        } catch (e) { console.warn('Failed to reconcile local artist id with server id', e); }

        // Persist server token & id
        if (serverToken) {
          api.setToken(serverToken);
          localStorage.setItem('ga_token', serverToken);
        }
        localStorage.setItem('artistId', serverUser.id);
        try { setArtistId(String(serverUser.id)); } catch (e) {}
        localStorage.setItem('currentUser', JSON.stringify(serverUser));
        // Update auth context to server user
        login({ user: serverUser, token: serverToken || mockToken });
      }
    }).catch(() => {});

    // redirect to artist dashboard (prefer id in URL)
    // navigate using local id (server id may come later and will be reconciled)
    const redirectId = artistId || id;
    try { setArtistId(String(redirectId)); } catch (e) {}
    navigate(`/artist/${redirectId}/dashboard`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const users = JSON.parse(localStorage.getItem("artists") || "[]");
    const foundLocal = users.find((u) => u.email === loginForm.email && u.password === loginForm.password);
    try {
      // Try backend login first
      const res = await api.login(loginForm.email, loginForm.password);
      // res: { user, token }
      const serverUser = res.user || res;
      // Upsert into local artists list so profile pages work locally
      try {
        const list = JSON.parse(localStorage.getItem('artists') || '[]');
        const idx = list.findIndex((a) => String(a.id) === String(serverUser.id));
        const obj = { id: serverUser.id, name: serverUser.name || serverUser.email, email: serverUser.email };
        if (idx >= 0) list[idx] = { ...list[idx], ...obj }; else list.push(obj);
        localStorage.setItem('artists', JSON.stringify(list));
      } catch (e) {}
      // Persist token & artistId before updating auth context to avoid race
      api.setToken(res.token);
      localStorage.setItem('artistId', serverUser.id);
      try { setArtistId(String(serverUser.id)); } catch (e) {}
      localStorage.setItem('ga_token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(serverUser));
      login(res);
      navigate(`/artist/${serverUser.id}/dashboard`);
      return;
    } catch (err) {
      // fallback to local storage method
    }
    if (!foundLocal) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    // Create & set mock token and persist it
    const mockToken = `mock-${foundLocal.id}`;
    api.setToken(mockToken);
    localStorage.setItem('ga_token', mockToken);
    localStorage.setItem("artistId", foundLocal.id);
    try { setArtistId(String(foundLocal.id)); } catch (e) {}
    localStorage.setItem('currentUser', JSON.stringify(foundLocal));
    // Update React auth context with token
    login({ user: foundLocal, token: mockToken });
    navigate(`/artist/${foundLocal.id}/dashboard`);
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