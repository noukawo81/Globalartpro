import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth.js";
import { api } from '@/services/api.js';

export default function ArtistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { artistId, setArtistId, login: setAuthUser, user: authUser } = useAuth();
  const isCurrentArtist = String(artistId) === String(id);

  // Simulation API – tu remplaceras plus tard par ton API réelle
  async function fetchArtistData() {
    setLoading(true);

    // 1) FIRST: Try to fetch from backend API (source of truth)
    try {
      const res = await api.getArtist(id);
      if (res && res.artist) {
        const apiArtist = res.artist;
        apiArtist.socials = apiArtist.socials || { youtube: "", website: "", facebook: "", tiktok: "" };
        apiArtist.artworks = apiArtist.artworks || [];
        setArtist(apiArtist);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Backend fetch failed, trying fallback sources', e);
    }

    // 2) FALLBACK: Try from localStorage (offline support)
    try {
      const list = JSON.parse(localStorage.getItem("artists") || "[]");
      const found = list.find((a) => String(a.id) === String(id));
      if (found) {
        found.socials = found.socials || { youtube: "", website: "", facebook: "", tiktok: "" };
        setArtist(found);
        setLoading(false);
        return;
      }
    } catch (e) {
      // ignore parse errors
    }

    // 3) FALLBACK: Use auth user data if viewing self
    if (authUser && String(authUser.id) === String(id)) {
      authUser.socials = authUser.socials || { youtube: "", website: "", facebook: "", tiktok: "" };
      setArtist(authUser);
      setLoading(false);
      return;
    }

    // 4) LAST RESORT: Default mock profile
    const mockData = {
      id,
      name: "Artiste Inconnu",
      avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=500",
      description: "Cet artiste n'a pas encore rempli son profil.",
      country: "Cameroun",
      socials: { youtube: "", website: "", facebook: "", tiktok: "" },
      artworks: [],
    };
    setArtist(mockData);
    setLoading(false);
  }

  useEffect(() => {
    // Guard against invalid id values caused by bad navigation or races
    if (!id || id === 'undefined' || id === 'null') {
      navigate('/artists');
      return;
    }
    fetchArtistData();
  }, [id]);

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    avatar: "",
    country: "",
    domain: "",
    description: "",
    socials: { youtube: "", website: "", facebook: "", tiktok: "" },
  });

  function openEditModal() {
    // préremplir le formulaire depuis l'artiste courant
    setEditForm({
      name: artist.name || "",
      avatar: artist.avatar || "",
      country: artist.country || "",
      domain: artist.domain || "",
      description: artist.description || "",
      socials: { ...(artist.socials || {}) },
    });
    setShowEdit(true);
  }

  // File upload (drag & drop) -> convert to base64
  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const base64 = ev.target.result;
      handleEditChange("avatar", base64);
    };
    reader.readAsDataURL(file);
  }

  function onDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function closeEditModal() {
    setShowEdit(false);
  }

  function handleEditChange(path, value) {
    if (path.startsWith("socials.")) {
      const key = path.split(".")[1];
      setEditForm((s) => ({ ...s, socials: { ...s.socials, [key]: value } }));
    } else {
      setEditForm((s) => ({ ...s, [path]: value }));
    }
  }

  function removeSocial(key) {
    const updated = { ...artist, socials: { ...(artist.socials || {}) } };
    delete updated.socials[key];
    // persist
    try {
      const list = JSON.parse(localStorage.getItem("artists") || "[]");
      const idx = list.findIndex((a) => String(a.id) === String(artist.id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...updated };
        localStorage.setItem("artists", JSON.stringify(list));
      }
    } catch (e) {}
    setArtist(updated);
    if (isCurrentArtist) {
      setAuthUser(updated);
      try { setArtistId(String(updated.id)); } catch (e) {}
      localStorage.setItem("artistId", updated.id);
    }
  }

  // Upload artworks (image/audio/video)
  function handleUploadFile(file, title = "Untitled", kind = "image") {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const src = ev.target.result;
      const newArt = { id: `art-${Date.now()}`, title: title || file.name, type: kind, src };
      const updated = { ...artist, artworks: [...(artist.artworks || []), newArt] };
      // persist
      try {
        const list = JSON.parse(localStorage.getItem("artists") || "[]");
        const idx = list.findIndex((a) => String(a.id) === String(artist.id));
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...updated };
          localStorage.setItem("artists", JSON.stringify(list));
        } else {
          list.push(updated);
          localStorage.setItem("artists", JSON.stringify(list));
        }
      } catch (e) {}
      setArtist(updated);
    };
    reader.readAsDataURL(file);
  }

  // Invite link generator (simple token stored in localStorage)
  function generateInviteLocal() {
    const token = `invite-${artist.id}-${Date.now()}`;
    try {
      const invites = JSON.parse(localStorage.getItem("invites") || "{}");
      invites[artist.id] = { token, createdAt: new Date().toISOString() };
      localStorage.setItem("invites", JSON.stringify(invites));
      const link = `${window.location.origin}/artist/invite/${token}`;
      navigator.clipboard?.writeText(link).catch(() => {});
      alert(`Lien d'invitation copié: ${link}`);
    } catch (e) {
      alert(`Lien d'invitation: ${token}`);
    }
  }

  async function handleInvite() {
    if (!artist || !artist.id) return alert('Artiste non identifié');
    try {
      const res = await api.generateInvite(artist.id);
      const link = res?.link || res?.invite?.link || res?.invite?.token ? `${window.location.origin}/artist/invite/${res?.invite?.token || res.token}` : null;
      if (link) {
        navigator.clipboard?.writeText(link).catch(() => {});
        alert(`Lien d'invitation copié: ${link}`);
        return;
      }
    } catch (e) {
      console.warn('backend invite failed, falling back to local', e);
    }
    generateInviteLocal();
  }

  function deleteAccount() {
    if (!confirm('Supprimer définitivement ce compte ? Cette action est irréversible.')) return;
    try {
      const list = JSON.parse(localStorage.getItem('artists') || '[]');
      const filtered = list.filter(a => String(a.id) !== String(artist.id));
      localStorage.setItem('artists', JSON.stringify(filtered));
      // clear auth if current
      if (isCurrentArtist) {
        try { setArtistId(null); } catch (e) {}
        localStorage.removeItem('artistId');
        localStorage.removeItem('token');
        localStorage.removeItem('ga_token');
        setAuthUser(null);
      }
      alert('Compte supprimé');
      // redirect
      window.location.href = '/';
    } catch (e) {
      console.error('deleteAccount error', e);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    const updated = {
      ...artist,
      name: editForm.name,
      avatar: editForm.avatar,
      country: editForm.country,
      domain: editForm.domain,
      description: editForm.description,
      socials: { ...editForm.socials },
    };

    // Try to persist to backend first (if token set)
    try {
      const res = await import('@/services/api.js').then(m => m.api.updateArtist(artist.id, updated)).catch(() => null);
      if (res && res.artist) {
        Object.assign(updated, res.artist);
      }
    } catch (e) {
      console.warn('backend update artist failed', e);
    }

    // update localStorage artists list
    try {
      const list = JSON.parse(localStorage.getItem("artists") || "[]");
      const idx = list.findIndex((a) => String(a.id) === String(artist.id));
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...updated };
        localStorage.setItem("artists", JSON.stringify(list));
      } else {
        // si non trouvé, on ajoute
        list.push(updated);
        localStorage.setItem("artists", JSON.stringify(list));
      }
    } catch (err) {
      console.error("Erreur mise à jour artists localStorage", err);
    }

    setArtist(updated);
    // mettre à jour le contexte d'auth si c'est le profil courant
    // Important: ne pas modifier le token d'auth lors d'une simple mise à jour de profil.
    if (isCurrentArtist) {
      // Met à jour uniquement les données utilisateur dans le contexte sans toucher au token
      setAuthUser({ user: updated });
      try { setArtistId(String(updated.id)); } catch (e) {}
      localStorage.setItem("artistId", updated.id);
    }

    setShowEdit(false);
  }

  async function handleMediaUpload(file) {
  if (!file) return;
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.uploadArtistMedia(artist.id, fd);
    // backend: { media: { id, title, url, ... } }
    if (res && res.media) {
      const m = res.media;
      setArtist((a) => ({ ...a, media: [...(a.media||[]), { id: m.id, url: m.url, title: m.title || file.name, mime: file.type, createdAt: m.createdAt || new Date().toISOString() }] }));
      setMessage('Upload réussi.');
    }
  } catch (e) {
    setMessage('Upload échoué.');
  }
}

async function shareMediaToMarketplace(mediaId, title = 'Œuvre', price = 0) {
  if (!api.getToken || !api.getToken()) { setMessage('Connexion requise pour mettre en vente.'); alert('Veuillez vous connecter.'); return; }
  try {
    const payload = { artistId: artist.id, mediaId, title, price };
    const res = await api.createListing(payload);
    if (res && res.listing) setMessage('Partagé sur le marketplace.');
    else setMessage(res?.error || 'Échec du partage.');
  } catch (e) {
    console.error('createListing error', e);
    setMessage(e?.response?.data?.error || e?.message || 'Échec du partage.');
  }
}

  if (loading) {
    return <p style={{ padding: 20 }}>Chargement du profil...</p>;
  }

  if (!artist) {
    return <p style={{ padding: 20 }}>Artiste introuvable.</p>;
  }

  return (
    <div style={styles.page}>
      {/* Bloc A - Identité */}
      <div style={styles.headerGrid}>
        <div style={styles.identityCard}>
          <img src={artist.avatar} alt={artist.name} style={styles.headerAvatar} />
          <div style={{ marginLeft: 16, flex: 1 }}>
            <h1 style={styles.artistName}>{artist.name} <span style={styles.verified}>✓</span></h1>
            <p style={styles.meta}>{artist.country} • {artist.domain || "Artiste"}</p>
            <p style={styles.bio}>{artist.description}</p>

            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              {isCurrentArtist && (
                  <button style={styles.primaryButton} onClick={() => navigate(`/artist/${id}/dashboard`)}>🎨 Mon Dashboard</button>
                )}
                {isCurrentArtist && (
                  <button style={styles.secondaryButton} onClick={() => openEditModal()}>✏️ Éditer mon profil</button>
                )}
              {isCurrentArtist && (
                <button style={styles.secondaryButton} onClick={() => handleInvite()}>🔗 Partager mon lien d'invitation</button>
              )}
              {!isCurrentArtist && artist.socials?.website && (
                <a href={artist.socials.website} target="_blank" rel="noreferrer" style={styles.linkButton}>Visiter le site</a>
              )}
            </div>
          </div>
        </div>

        {/* Bloc B - Ressources & portfolio (mini aperçu) */}
        <div style={styles.resourcesCard}>
          <h3>Ressources & Portfolio</h3>
          <div style={styles.galleryGrid}>
            {([...(artist.media||[]), ...(artist.artworks||[])]).map((a) => (
              <div key={a.id} style={styles.thumb} onClick={() => window.open(a.url || a.src || a.image, '_blank')}>
                {(!a.type || a.type === 'image') && (<img src={a.url || a.src || a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)}
                {a.type === 'video' && (<video src={a.url || a.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />)}
                {a.type === 'audio' && (<div style={{ padding: 8 }}>🎵 {a.title || 'Audio'}</div>)}

                {isCurrentArtist && (
                  <div style={{ position: 'absolute', bottom: 6, left: 6, display: 'flex', gap: 6 }}>
                    <button style={styles.smallButton} onClick={(e) => { e.stopPropagation(); shareMediaToMarketplace(a.id, a.title || 'Œuvre', 1); }}>➕ Mettre en vente</button>
                    <button style={styles.smallButton} onClick={(e) => { e.stopPropagation(); if (!api.getToken || !api.getToken()) { setMessage('Connexion requise pour partager.'); alert('Veuillez vous connecter.'); return; } api.shareToPortal({ artistId: artist.id, mediaId: a.id, title: a.title || 'Partage' }).then(() => setMessage('Partagé sur le portail.')).catch((err) => { console.error('portal share error', err); setMessage(err?.response?.data?.error || 'Échec du partage.'); }); }}>🌍 Partager</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
            {artist.socials?.youtube && (
              <div>
                <a href={artist.socials.youtube} target="_blank" rel="noreferrer">YouTube</a>
                {isCurrentArtist && <button style={styles.smallX} onClick={() => removeSocial('youtube')}>✕</button>}
              </div>
            )}
            {artist.socials?.facebook && (
              <div>
                <a href={artist.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
                {isCurrentArtist && <button style={styles.smallX} onClick={() => removeSocial('facebook')}>✕</button>}
              </div>
            )}
            {artist.socials?.tiktok && (
              <div>
                <a href={artist.socials.tiktok} target="_blank" rel="noreferrer">TikTok</a>
                {isCurrentArtist && <button style={styles.smallX} onClick={() => removeSocial('tiktok')}>✕</button>}
              </div>
            )}
          </div>

          {isCurrentArtist && (
            <div style={{ marginTop: 12 }}>
              <h4>Ajouter un média (image, vidéo courte, audio)</h4>
              <form onSubmit={(e) => { e.preventDefault(); const f = e.target.file.files[0]; const title = e.target.title.value || f?.name; const kind = e.target.kind.value; if (f) handleUploadFile(f, title, kind); e.target.reset(); }}>
                <input name="title" placeholder="Titre (optionnel)" style={{ marginRight: 8 }} />
                <select name="kind" defaultValue="image" style={{ marginRight: 8 }}>
                  <option value="image">Image</option>
                  <option value="video">Vidéo courte</option>
                  <option value="audio">Audio</option>
                </select>
                <input name="file" type="file" accept="image/*,video/*,audio/*" style={{ marginRight: 8 }} />
                <button type="submit">Télécharger</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {message && <div style={{ padding: 12, background: '#fff5c7', borderRadius: 6, margin: '12px 0' }}>{message}</div>}

      {/* Bloc C - Outils & Services GlobalArtPro */}
      <div style={styles.servicesSection}>
        <h2>Outils & Services</h2>
        <div style={styles.servicesGrid}>
          <button style={styles.serviceCard} onClick={() => navigate('/gapstudio')}><span style={styles.serviceIcon}>✨</span><span style={styles.serviceLabel}>GAP Studio (AI)</span></button>
          <button style={styles.serviceCard} onClick={() => navigate('/portal-culture')}><span style={styles.serviceIcon}>🌍</span><span style={styles.serviceLabel}>Portail Culturel</span></button>
          <button style={styles.serviceCard} onClick={() => navigate('/marketplace')}><span style={styles.serviceIcon}>🛒</span><span style={styles.serviceLabel}>Marketplace</span></button>
          <button style={styles.serviceCard} onClick={() => navigate('/mine-artc')}><span style={styles.serviceIcon}>💰</span><span style={styles.serviceLabel}>PIcoin / ARTC</span></button>
          <button style={styles.serviceCard} onClick={() => navigate('/dashboard')}><span style={styles.serviceIcon}>📈</span><span style={styles.serviceLabel}>Statistiques</span></button>
          <button style={styles.serviceCard} onClick={() => setShowSecurity(true)}><span style={styles.serviceIcon}>🔒</span><span style={styles.serviceLabel}>Sécurité & Auth</span></button>
        </div>
      </div>

      {/* Bloc D - Interaction & Communauté */}
      <div style={styles.communitySection}>
        <h2>Interaction & Communauté</h2>
        <div style={styles.communityGrid}>
          <div style={styles.communityCard}>
            <h4>Messages</h4>
            <p>Demandes de fans et collaborations.</p>
          </div>
          <div style={styles.communityCard}>
            <h4>Commentaires</h4>
            <p>Gérer les retours sur vos œuvres.</p>
          </div>
          <div style={styles.communityCard}>
            <h4>Lives</h4>
            <p>Programmer des diffusions et sessions premium.</p>
          </div>
        </div>
      </div>
      {/* Edit modal */}
      {showEdit && (
        <div style={styles.modalOverlay} onClick={closeEditModal}>
          <form style={styles.modalBox} onClick={(e) => e.stopPropagation()} onSubmit={handleSaveEdit}>
            <h3>Éditer mon profil</h3>

            {/* Dropzone / Upload */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={styles.dropzone}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onClick={() => document.getElementById('avatarFileInput').click()}
                title="Cliquer pour choisir un fichier ou glisser-déposer"
              >
                {editForm.avatar ? (
                  <img src={editForm.avatar} alt="preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: '#666' }}>Glisser-déposer une photo ou cliquer pour sélectionner</div>
                )}
              </div>
              <input id="avatarFileInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) handleFile(f); }} />
            </div>

            <div style={styles.modalRow}>
              <input style={styles.modalInput} value={editForm.name} onChange={(e) => handleEditChange('name', e.target.value)} placeholder="Nom complet" />
              <input style={styles.modalInput} value={editForm.country} onChange={(e) => handleEditChange('country', e.target.value)} placeholder="Pays / Origine" />
            </div>
            <div style={styles.modalRow}>
              <input style={styles.modalInput} value={editForm.domain} onChange={(e) => handleEditChange('domain', e.target.value)} placeholder="Discipline / Domaine" />
              <input style={styles.modalInput} value={editForm.avatar} onChange={(e) => handleEditChange('avatar', e.target.value)} placeholder="URL photo de profil (ou uploader)" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <textarea style={{ ...styles.modalInput, minHeight: 100 }} value={editForm.description} onChange={(e) => handleEditChange('description', e.target.value)} placeholder="Mini-biographie" />
            </div>
            <div style={styles.modalRow}>
              <input style={styles.modalInput} value={editForm.socials.youtube || ''} onChange={(e) => handleEditChange('socials.youtube', e.target.value)} placeholder="YouTube (URL)" />
            </div>
            <div style={styles.modalRow}>
              <input style={styles.modalInput} value={editForm.socials.facebook || ''} onChange={(e) => handleEditChange('socials.facebook', e.target.value)} placeholder="Facebook (URL)" />
              <input style={styles.modalInput} value={editForm.socials.tiktok || ''} onChange={(e) => handleEditChange('socials.tiktok', e.target.value)} placeholder="TikTok (URL)" />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <input style={{ ...styles.modalInput }} value={editForm.socials.website || ''} onChange={(e) => handleEditChange('socials.website', e.target.value)} placeholder="Site web (URL)" />
            </div>
            <div style={styles.modalButtons}>
              <button type="button" style={styles.cancelButton} onClick={closeEditModal}>Annuler</button>
              <button type="submit" style={styles.saveButton}>Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      {/* Security modal (placeholder) */}
      {showSecurity && (
        <div style={styles.modalOverlay} onClick={() => setShowSecurity(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h3>Sécurité & Authentification</h3>
            <div style={{ marginBottom: 12 }}>
              <h4>Vérification d'identité</h4>
              <p>Statut actuel : Non vérifiée</p>
              <button style={styles.primaryButton} onClick={() => alert('Vérification via Stripe / Jumio — à implémenter')}>Vérifier mon identité</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <h4>Connexion aux wallets</h4>
              <button style={styles.primaryButton} onClick={() => alert('Connexion Pi Wallet — à implémenter')}>Connecter Pi Wallet</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <h4>Paramètres de compte</h4>
              <button style={styles.secondaryButton} onClick={() => alert('Authentification 2FA — à implémenter')}>Activer 2FA</button>
            </div>
            <button style={styles.cancelButton} onClick={() => setShowSecurity(false)}>Fermer</button>
          </div>
        </div>
      )}

      {/* Settings modal (account management) */}
      {showSettings && (
        <div style={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div style={styles.settingsBox} onClick={(e) => e.stopPropagation()}>
            <h3>Paramètres du compte</h3>
            <div style={{ marginBottom: 12 }}>
              <h4>Supprimer le compte</h4>
              <p>Supprimer votre compte et toutes les données locales associées.</p>
              <button style={{ ...styles.cancelButton, background: '#ffc0c0' }} onClick={deleteAccount}>Supprimer mon compte</button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <h4>Préférences</h4>
              <p>Préférences basiques du compte (visibilité, téléchargements...)</p>
              <button style={styles.secondaryButton} onClick={() => alert('Paramètres additionnels — à implémenter')}>Modifier mes préférences</button>
            </div>
            <button style={styles.cancelButton} onClick={() => setShowSettings(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  editInput: { width: "100%", padding: "0.6em", borderRadius: 6, border: "1px solid #ccc", background: "#fff", color: "#111", },
  page: { padding: '20px', maxWidth: 1100, margin: '0 auto', color: '#111', fontFamily: 'system-ui, sans-serif' },
  headerGrid: { display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, alignItems: 'start', marginBottom: 24 },
  identityCard: { display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
  headerAvatar: { width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 6px 14px rgba(0,0,0,0.08)' },
  artistName: { margin: 0, fontSize: '1.6em' },
  verified: { color: '#00b894', marginLeft: 8, fontSize: '0.8em' },
  meta: { margin: '6px 0', color: '#666' },
  bio: { margin: 0, color: '#333' },
  primaryButton: { padding: '10px 14px', background: '#ffd700', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: '700' },
  secondaryButton: { padding: '10px 14px', background: '#eee', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' },
  linkButton: { padding: '10px 14px', color: '#0066cc', textDecoration: 'none' },
  resourcesCard: { background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
  galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8, marginTop: 8 },
  thumb: { width: '100%', height: 80, overflow: 'hidden', borderRadius: 6, cursor: 'pointer' },
  servicesSection: { marginTop: 20, background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.04)' },
  servicesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 12 },
  serviceCard: { padding: 14, borderRadius: 10, background: '#fafafa', border: '1px solid #eee', cursor: 'pointer', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  serviceIcon: { fontSize: '1.8em' },
  serviceLabel: { fontSize: '0.85em', textAlign: 'center' },
  communitySection: { marginTop: 20 },
  communityGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 12 },
  communityCard: { background: '#fff', padding: 14, borderRadius: 10, boxShadow: '0 6px 14px rgba(0,0,0,0.04)' },
  /* Modal edition */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalBox: {
    width: 'min(720px, 96%)',
    background: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  },
  dropzone: { border: '2px dashed #ddd', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 90, cursor: 'pointer', background: '#fafafa' },
  modalRow: { display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' },
  modalInput: { flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#fff', color: '#111', caretColor: '#111', WebkitTextFillColor: '#111' },
  modalButtons: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 },
  saveButton: { padding: '10px 14px', background: '#ffd700', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 },
  cancelButton: { padding: '10px 14px', background: '#eee', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' },
  smallX: { marginLeft: 6, background: 'transparent', border: 'none', color: '#c00', cursor: 'pointer' },
  settingsBox: { width: 'min(420px, 96%)', background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' },
};