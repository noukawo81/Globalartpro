import React, { useState, useEffect } from "react";
import "./GAPStudioHome.css"; // styles séparés
import gapstudioApi from "../services/gapstudio.api";

const GAPStudioHome = () => {
  // STATES
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photoreal");
  const [culture, setCulture] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [variants, setVariants] = useState(1);
  const [imageUrl, setImageUrl] = useState(null);
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('gap_recent')||'[]'));
  const [gallery, setGallery] = useState(() => JSON.parse(localStorage.getItem('gap_gallery')||'[]'));
  const [seedImage, setSeedImage] = useState(null); // base64 or url
  const [requests, setRequests] = useState(0);
  const [audioPrompt, setAudioPrompt] = useState("");
  const [audioPreview, setAudioPreview] = useState(null);
  const [textSeed, setTextSeed] = useState("");
  const [textType, setTextType] = useState("description");
  const [textResult, setTextResult] = useState("");
  const [mintMessage, setMintMessage] = useState("");
  const [loading, setLoading] = useState(false);



  // Theme (light/dark)
  const [darkMode, _setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) document.body.classList.add('gap-dark');
    else document.body.classList.remove('gap-dark');
  }, [darkMode]);

  const PRESETS = [
    { id: 'portrait', label: 'Portrait traditionnel', prompt: 'Portrait of a wise elder, detailed, warm tones, cultural attire' },
    { id: 'landscape', label: 'Paysage mystique', prompt: 'Dreamlike landscape with dramatic light, floating islands, cinematic' },
    { id: 'abstract', label: 'Abstrait vibrant', prompt: 'Vibrant abstract composition, bold colors, textured brush strokes' },
  ];
  // voice recording
  const [recording, setRecording] = useState(false);
  const [recAudioUrl, setRecAudioUrl] = useState(null);
  const mediaRef = React.useRef(null);

  // GENERATE IMAGE
  const handleGenerateImage = async () => {
    if (!prompt.trim()) return alert("Écris un prompt.");

    setRequests((r) => r + 1);
    setLoading(true);
    setImageUrl(null);

    try {
      const payload = {
        prompt,
        width: Number(width) || 1024,
        height: Number(height) || 1024,
        style,
        culture,
        n: Number(variants) || 1,
      };
      if (seedImage) payload.seed = seedImage;

      // Use gapstudioApi which provides fallbacks and consistent API base
      const data = await gapstudioApi.generateImage(payload);
      const url = data.url || data.image || data.images?.[0] || null;

      if (!url) {
        alert('Aucune image renvoyée (backend indisponible)');
      } else {
        setImageUrl(url);
        const entry = { url, prompt, style, createdAt: new Date().toISOString() };
        setRecent((prev) => {
          const next = [entry, ...prev].slice(0, 24);
          localStorage.setItem('gap_recent', JSON.stringify(next));
          return next;
        });
      }
    } catch (err) {
      console.error(err);
      const message = (err.message || '').toLowerCase();
      if (message.includes('402') || message.includes('insufficient funds')) {
        alert('Solde insuffisant: recharger ARTC/IA depuis votre Wallet.');
      } else {
        alert('Erreur lors de la génération.');
      }
    } finally {
      setLoading(false);
    }
  };

  // DOWNLOAD
  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "gap-image";
    a.click();
  };

  // ADD TO GALLERY
  const addToGallery = () => {
    if (!imageUrl) return alert('Aucune image à ajouter');
    const entry = { url: imageUrl, prompt, createdAt: new Date().toISOString() };
    const next = [entry, ...gallery].slice(0, 100);
    setGallery(next);
    localStorage.setItem('gap_gallery', JSON.stringify(next));
    alert('Image ajoutée à votre GAP Gallery locale');
  };

  // GENERATE TEXT
  const handleGenerateText = async () => {
    if (!textSeed.trim()) return alert('Écris un sujet.');
    setRequests((r) => r + 1);
    setLoading(true);
    try {
      // Backend text endpoint may not be implemented — provide local simulated generation
      const simulated = `Génération simulée (${textType}) pour "${textSeed}":\n- Idée 1: Une courte description artistique inspirée de ${textSeed}.\n- Idée 2: Variante alternative et titre possible.`;
      await new Promise((res) => setTimeout(res, 700));
      setTextResult(simulated);
    } catch (err) {
      console.error(err);
      alert('Erreur génération texte');
    } finally {
      setLoading(false);
    }
  };

  // GENERATE AUDIO
  const handleGenerateAudio = async () => {
    if (!audioPrompt.trim() && !recAudioUrl) return alert('Écris un prompt audio ou enregistre un message.');
    setRequests((r) => r + 1);
    setLoading(true);
    try {
      // If user recorded audio, prefer playback of that recording as preview
      if (recAudioUrl) {
        setAudioPreview(recAudioUrl);
      } else {
        // Backend audio may be unavailable — use a small simulated audio URL (placeholder)
        await new Promise((res) => setTimeout(res, 900));
        const sample = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        setAudioPreview(sample);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur génération audio');
    } finally {
      setLoading(false);
    }
  };

  // FILE UPLOAD for seed image
  const handleUploadFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setSeedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // copy prompt
  // removed copyPrompt per request

  const applyPreset = (p) => {
    setPrompt(p.prompt);
    setStyle('digital');
  };

  // Recording helpers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecAudioUrl(url);
        // set as audioPreview for playback
        setAudioPreview(url);
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (err) {
      console.error('microphone error', err);
      alert('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop();
      setRecording(false);
    }
  };

  const handleMintNFT = async () => {
    if (!imageUrl) return alert("Génère d'abord une image");
    setMintMessage("Minting...");
    try {
      const data = await gapstudioApi.mintNFT(imageUrl, prompt);
      setMintMessage(data?.message || `Mint simulé — id: ${data?.nftId || 'sim-' + Date.now()}`);
    } catch (err) {
      console.error(err);
      setMintMessage("Erreur mint");
    }
    setTimeout(() => setMintMessage(''), 4000);
  };

  return (
    <div className="wrap">
      <header>
        <div className="logo">GAP</div>
        <div>
          <h1>STUDIO—IA</h1>
          <p>Image · Son · Texte · NFT — Studio IA orienté art & culture mondiale</p>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
          <div className="badge">PI <strong>0</strong></div>
          <button className="ghost">Connect</button>
        </div>
      </header>

      <main className="grid">
        <section className="leftCol">
          {/* IMAGE MODULE */}
          <div className="card section">
            <div className="title">
              <h2>Quick Image Studio — Text → Image</h2>
              <div className="controls">
                <select className="field small" value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option value="photoreal">Photo réaliste</option>
                  <option value="traditional">Traditionnel</option>
                  <option value="surreal">Surréaliste</option>
                  <option value="futuristic">Futuriste</option>
                  <option value="digital">Art numérique</option>
                </select>

                <select className="field small" value={culture} onChange={(e) => setCulture(e.target.value)}>
                  <option value="">Any culture</option>
                  <option value="african">African motifs</option>
                  <option value="asian">Asian motifs</option>
                  <option value="latin">Latin American</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <select className="field small" defaultValue="" onChange={(e) => {
                const id = e.target.value; if (!id) return; const p = PRESETS.find(x => x.id === id); if (p) applyPreset(p);
              }}>
                <option value="">Choisir un preset...</option>
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
                <button className="ghost" onClick={() => { if (recording) stopRecording(); else startRecording(); }}>{recording ? 'Stop' : '🎙️ Enregistrer'}</button>
                <label className="ghost" style={{ cursor: 'pointer' }}>
                  📷 Import seed
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUploadFile(e.target.files && e.target.files[0])} />
                </label>
                <button className="ghost" onClick={() => { if (gallery.length) setImageUrl(gallery[0].url); else alert('Galerie vide'); }}>Galerie</button>
              </div>
            </div>

            <textarea
              className="field"
              rows={3}
              placeholder="Décris ton image..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{ color: '#111', background: '#fff' }}
            />

            <div className="row">
              <input type="number" min={128} max={4096} className="field small" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
              <input type="number" min={128} max={4096} className="field small" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
              <input type="number" min={1} max={8} className="field small" value={variants} onChange={(e) => setVariants(Number(e.target.value))} />
              <button className="btn" onClick={handleGenerateImage}>Générer image</button>
              <button className="ghost">Upscale</button>
            </div>

            <div className="section">
              <div className="preview card">
                {loading && <div className="muted-block">Génération en cours…</div>}
                {!loading && !imageUrl && <div className="muted-block">Aucune image</div>}
                {imageUrl && !loading && (
                  <img src={imageUrl} alt="preview" />
                )}
              </div>

              {imageUrl && !loading && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: 'center' }}>
                  <button className="ghost" onClick={downloadImage}>Télécharger</button>
                  <button className="ghost" onClick={addToGallery}>Ajouter à Gallery</button>
                  <button className="ghost" onClick={handleMintNFT}>Minter (NFT)</button>
                  {mintMessage && <span style={{ marginLeft: 8 }}>{mintMessage}</span>}
                </div>
              )}
            </div>
          </div>

          {/* SOUND */}
          <div className="card section">
            <div className="title">
              <h2>GAP Sound — Générateur audio</h2>
              <div className="muted">MP3 export</div>
            </div>
            <input className="field" placeholder="Prompt audio" value={audioPrompt} onChange={(e) => setAudioPrompt(e.target.value)} />
            <button className="btn" onClick={handleGenerateAudio}>Générer audio</button>
            <div className="muted-block">
              {audioPreview ? <audio controls src={audioPreview} /> : "Aucun audio"}
            </div>
          </div>

          {/* TEXT */}
          <div className="card section">
            <div className="title">
              <h2>GAP Text — Description & Titres</h2>
            </div>

            <input className="field" placeholder="Sujet" value={textSeed} onChange={(e) => setTextSeed(e.target.value)} />

            <select className="field small" value={textType} onChange={(e) => setTextType(e.target.value)}>
              <option value="title">Titre</option>
              <option value="description">Description</option>
              <option value="bio">Bio</option>
              <option value="caption">Caption</option>
            </select>

            <button className="btn" onClick={handleGenerateText}>Générer texte</button>

            <textarea className="field" rows={4} value={textResult} onChange={(e) => setTextResult(e.target.value)} />
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <aside className="rightCol">
          <div className="card section">
            <div className="title"><h2>Studio quick stats</h2></div>
            <div className="stat"><div>Requests today</div><strong>{requests}</strong></div>
          </div>

          <div className="card section">
            <h2>Recent creations</h2>
            <div className="thumbs">
              {recent.map((r, i) => (
                <img key={i} src={r.url || r} alt="" style={{ width: "80px", borderRadius: "8px", cursor: 'pointer' }} onClick={() => setImageUrl(r.url || r)} />
              ))}
            </div>
          </div>

          <div className="card section">
            <h2>My GAP Gallery</h2>
            <div className="thumbs">
              {gallery.length === 0 && <div className="muted-block">Aucune image en galerie</div>}
              {gallery.map((g, i) => (
                <img key={i} src={g.url} alt="" style={{ width: "80px", borderRadius: "8px", cursor: 'pointer' }} onClick={() => setImageUrl(g.url)} />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default GAPStudioHome;