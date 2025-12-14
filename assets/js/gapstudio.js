// Gapstudio.js
// Emplacement recommandé : GlobalArtpro/assets/JS/Gapstudio.js
// Auteur : assistant — version livrable local-first
// ------------------------------------------------------------------
// Utilisation : inclure <script src="/assets/JS/Gapstudio.js" defer></script>
// ------------------------------------------------------------------

(() => {
  'use strict';

  /* -------------------------
     Configuration (modifiable)
     ------------------------- */
  const API_FALLBACK_ENDPOINT = '/api/gapstudio/generate'; // endpoint backend (si présent)
  // si tu utilises VITE_API_URL ou autre, le code utilisera automatiquement window.VITE_API_URL
  const SIMULATE_IF_NO_BACKEND = true; // true => simule une réponse si backend indisponible
  const SIMULATED_IMAGE = 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=60'; // placeholder

  /* -------------------------
     DOM helpers
     ------------------------- */
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.flat().forEach(c => {
      if (c == null) return;
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  /* -------------------------
     Small UI helpers
     ------------------------- */
  function showToast(message, type = 'info', timeout = 3000) {
    let container = $('#gap-toast-container');
    if (!container) {
      container = el('div', { id: 'gap-toast-container', style: 'position:fixed;right:16px;bottom:16px;z-index:9999' });
      document.body.appendChild(container);
    }
    const item = el('div', { class: `gap-toast gap-toast-${type}`, style: 'margin-top:8px;padding:10px 14px;border-radius:8px;background:rgba(0,0,0,0.7);color:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.4);' }, message);
    container.appendChild(item);
    setTimeout(() => item.style.opacity = '0.0', timeout - 300);
    setTimeout(() => item.remove(), timeout);
  }

  function createLoader() {
    const wrapper = el('div', { class: 'gap-loader', style: 'display:flex;align-items:center;gap:10px' });
    const spinner = el('div', { style: 'width:18px;height:18px;border-radius:50%;border:3px solid rgba(255,255,255,0.08);border-top-color:#ffd700;animation:gap-spin 0.9s linear infinite' });
    const text = el('div', {}, 'Génération en cours...');
    wrapper.appendChild(spinner);
    wrapper.appendChild(text);
    return wrapper;
  }

  /* -------------------------
     Module catalogue (exemples)
     ------------------------- */
  const MODULES = [
    {
      id: 'image-ai',
      title: 'Générateur d’images (IA)',
      desc: "Crée des visuels inspirés des cultures du monde. Prompt → image.",
      type: 'image'
    },
    {
      id: 'audio-ai',
      title: 'Générateur audio (IA)',
      desc: "Courtes ambiances sonores et boucles instrumentales.",
      type: 'audio'
    },
    {
      id: 'nft-mint',
      title: 'Créer & Certifier (NFT)',
      desc: "Génère un certificat et prépare la mise en vente sur Pi.",
      type: 'nft'
    },
    {
      id: 'translate',
      title: 'Traduction & Voix',
      desc: "Traduction multilingue + synthèse vocale pour langues africaines.",
      type: 'utility'
    },
    {
      id: 'gap-export',
      title: 'Exporter / Publier',
      desc: "Prépare vos œuvres (watermark, métadonnées) pour la galerie GAP.",
      type: 'utility'
    }
  ];

  /* -------------------------
     Rendu UI modules
     ------------------------- */
  function renderModules() {
    const target = $('#gap-modules');
    if (!target) return;
    target.innerHTML = '';
    const grid = el('div', { class: 'gap-module-grid', style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px' });
    MODULES.forEach(mod => {
      const card = el('div', { class: 'gap-module-card', style: 'background:#121212;padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.04);' },
        el('h3', { style: 'margin:0 0 8px;color:#ffd700' }, mod.title),
        el('p', { style: 'margin:0 0 12px;color:#cfcfcf;font-size:0.95rem' }, mod.desc),
        el('div', { style: 'display:flex;gap:8px;justify-content:flex-end' },
          el('button', { class: 'gap-btn gap-btn-primary', 'data-id': mod.id, style: 'padding:8px 12px;border-radius:8px;border:none;cursor:pointer;background:linear-gradient(90deg,#6a11cb,#ffd700);color:#111;font-weight:700' }, 'Ouvrir'),
          el('button', { class: 'gap-btn gap-btn-ghost', 'data-id': mod.id, style: 'padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);color:#fff;cursor:pointer;background:transparent' }, 'Aperçu')
        )
      );
      grid.appendChild(card);
    });
    target.appendChild(grid);

    // délégation évènements
    target.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const label = btn.textContent.trim().toLowerCase();
      if (label === 'ouvrir') openModuleModal(id);
      else openModulePreview(id);
    });
  }

  /* -------------------------
     Modal / Preview
     ------------------------- */
  function ensureModal() {
    let modal = $('#gap-modal');
    if (!modal) {
      modal = el('div', { id: 'gap-modal', style: `position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);z-index:9998;padding:20px;` });
      modal.innerHTML = '<div id="gap-modal-card" style="width:100%;max-width:820px;background:#0f0f0f;border-radius:12px;padding:18px;box-shadow:0 30px 80px rgba(0,0,0,0.6);"></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click', (ev) => {
        if (ev.target === modal) closeModal();
      });
    }
    return modal;
  }

  function closeModal() {
    const modal = $('#gap-modal');
    if (modal) modal.remove();
  }

  function openModulePreview(id) {
    const mod = MODULES.find(m => m.id === id);
    if (!mod) { showToast('Module introuvable', 'error'); return; }
    const modal = ensureModal();
    const card = $('#gap-modal-card');
    card.innerHTML = '';
    card.appendChild(el('h2', { style: 'margin:0 0 8px;color:#ffd700' }, mod.title + ' — Aperçu'));
    card.appendChild(el('p', { style: 'color:#ddd;margin-bottom:12px' }, mod.desc));
    card.appendChild(el('div', { style: 'display:flex;gap:8px;justify-content:flex-end' },
      el('button', { style: 'padding:8px 10px;border-radius:8px;border:none;background:#333;color:#fff;cursor:pointer' , onclick: () => { closeModal(); openModuleModal(id);} }, 'Tester'),
      el('button', { style: 'padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:#fff;cursor:pointer', onclick: closeModal }, 'Fermer')
    ));
  }

  /* -------------------------
     Modal avec formulaire selon module
     ------------------------- */
  function openModuleModal(id) {
    const mod = MODULES.find(m => m.id === id);
    if (!mod) { showToast('Module introuvable', 'error'); return; }
    const modal = ensureModal();
    const card = $('#gap-modal-card');
    card.innerHTML = '';

    const header = el('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px' },
      el('h2', { style: 'margin:0;color:#ffd700' }, mod.title),
      el('button', { style: 'background:transparent;color:#fff;border:none;cursor:pointer;font-size:18px' , onclick: closeModal }, '✕')
    );

    const form = el('form', { id: 'gap-module-form', style: 'display:flex;flex-direction:column;gap:10px' });

    // Prompt / Description
    form.appendChild(el('label', {}, 'Décris ce que tu veux générer (prompt)'));
    const promptInput = el('textarea', { id: 'gap-prompt', rows: 3, style: 'width:100%;padding:10px;border-radius:8px;background:#111;border:1px solid #222;color:#fff' });
    form.appendChild(promptInput);

    // Upload zone
    const uploadLabel = el('label', {}, 'Image d’exemple (optionnel)');
    const fileInput = el('input', { id: 'gap-file', type: 'file', accept: 'image/*' });
    const dropZone = el('div', { id: 'gap-dropzone', style: 'border:1px dashed rgba(255,255,255,0.06);padding:12px;border-radius:8px;text-align:center;color:#cfcfcf' }, 'Glisser déposer une image ici ou cliquer pour sélectionner');
    form.appendChild(uploadLabel);
    form.appendChild(dropZone);
    form.appendChild(fileInput);

    // Options simples
    const optionsRow = el('div', { style: 'display:flex;gap:8px' },
      el('select', { id: 'gap-style', style: 'padding:8px;border-radius:8px;background:#111;color:#fff;border:1px solid #222' },
        el('option', { value: 'auto' }, 'Style automatique'),
        el('option', { value: 'traditionnel' }, 'Traditionnel'),
        el('option', { value: 'contemporain' }, 'Contemporain'),
        el('option', { value: 'fantastique' }, 'Fantastique')
      ),
      el('input', { id: 'gap-width', type: 'number', placeholder: 'W px (ex: 1024)', style: 'padding:8px;border-radius:8px;background:#111;color:#fff;border:1px solid #222' })
    );
    form.appendChild(optionsRow);

    // Actions
    const actions = el('div', { style: 'display:flex;gap:8px;justify-content:flex-end;margin-top:6px' },
      el('button', { type: 'submit', style: 'padding:10px 14px;border-radius:8px;border:none;cursor:pointer;background:linear-gradient(90deg,#6a11cb,#ffd700);color:#111;font-weight:700' }, 'Générer'),
      el('button', { type: 'button', style: 'padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:#fff;cursor:pointer' , onclick: closeModal }, 'Annuler')
    );

    // Output area
    const output = el('div', { id: 'gap-output', style: 'margin-top:12px;min-height:120px;display:flex;flex-direction:column;gap:8px' });

    form.appendChild(actions);
    card.appendChild(header);
    card.appendChild(form);
    card.appendChild(output);

    // Drop zone / file input behavior
    dropZone.addEventListener('click', () => fileInput.click());
    ['dragenter','dragover'].forEach(ev => {
      dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.style.background = 'rgba(255,255,255,0.02)'; });
    });
    ['dragleave','drop'].forEach(ev => {
      dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.style.background = 'transparent'; });
    });
    dropZone.addEventListener('drop', (e) => {
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) fileInput.files = e.dataTransfer.files;
    });

    // submit handler
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const prompt = promptInput.value.trim();
      const style = $('#gap-style').value;
      const width = parseInt($('#gap-width').value) || 1024;
      const file = fileInput.files && fileInput.files[0];

      if (!prompt && mod.type === 'image') {
        showToast('Décris ton image dans le prompt.', 'error');
        return;
      }

      output.innerHTML = '';
      const loader = createLoader();
      output.appendChild(loader);

      try {
        const res = await generate({
          module: mod.id,
          prompt,
          style,
          width,
          file
        });
        output.innerHTML = '';

        if (res && res.url) {
          const img = el('img', { src: res.url, style: 'max-width:100%;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,0.5)' });
          // watermark GAP visible bottom-right
          const wrapper = el('div', { style: 'position:relative;display:inline-block;' }, img,
            el('div', { style: 'position:absolute;right:8px;bottom:8px;background:#6a11cb;color:#fff;padding:3px 6px;border-radius:6px;font-weight:700;font-size:12px;opacity:0.9' }, 'gap')
          );
          output.appendChild(wrapper);

          const downloadBtn = el('a', { href: res.url, download: 'gap_result.jpg', style: 'display:inline-block;margin-top:8px;padding:8px 12px;border-radius:8px;background:#ffd700;color:#111;font-weight:700;text-decoration:none' }, 'Télécharger');
          output.appendChild(downloadBtn);
          showToast('Génération terminée.', 'success');
        } else if (res && res.message) {
          output.appendChild(el('div', { style: 'color:#ddd' }, res.message));
        } else {
          output.appendChild(el('div', { style: 'color:#ddd' }, 'Aucun résultat retourné.'));
        }
      } catch (err) {
        output.innerHTML = '';
        output.appendChild(el('div', { style: 'color:#f66' }, 'Erreur : ' + (err.message || err)));
        showToast('Échec de génération.', 'error');
      }
    });
  }

  /* -------------------------
     Génération (appel API ou simulation)
     ------------------------- */
  async function generate({ module, prompt, style, width, file }) {
    // Prépare FormData si fichier
    let form;
    if (file) {
      form = new FormData();
      form.append('file', file);
      form.append('prompt', prompt || '');
      form.append('style', style || '');
      form.append('width', width || 1024);
      form.append('module', module);
    } else {
      form = JSON.stringify({ prompt, style, width, module });
    }

    // Détermine l'endpoint
    const base = (window.VITE_API_URL && window.VITE_API_URL.trim()) ? (window.VITE_API_URL.replace(/\/$/, '') + '/gapstudio/generate') : API_FALLBACK_ENDPOINT;

    // Si backend non défini et simulation activée -> simule
    if (SIMULATE_IF_NO_BACKEND) {
      try {
        // Tenter un appel réel mais timeout court
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500); // 2.5s pour savoir si back dispo
        const response = await fetch(base, {
          method: file ? 'POST' : 'POST',
          headers: file ? {} : { 'Content-Type': 'application/json' },
          body: file ? form : form,
          signal: controller.signal
        }).finally(() => clearTimeout(timeout));

        if (!response.ok) throw new Error('Backend non disponible ou a renvoyé une erreur.');
        // On suppose que le backend renvoie { url: "https://..." }
        const data = await response.json();
        return data;
      } catch (e) {
        // Pas de backend -> simulation lente pour l'UX
        await wait(1400);
        return { url: SIMULATED_IMAGE, message: 'Réponse simulée (mode local).' };
      }
    } else {
      // Force call backend, remonter erreur si indisponible
      const response = await fetch(base, {
        method: file ? 'POST' : 'POST',
        headers: file ? {} : { 'Content-Type': 'application/json' },
        body: file ? form : form
      });
      if (!response.ok) {
        const text = await response.text().catch(()=>null);
        throw new Error('Backend error: ' + (text || response.status));
      }
      const data = await response.json();
      return data;
    }
  }

  function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

  /* -------------------------
     Init - liaison UI de la page Gapstudio
     ------------------------- */
  function initGapstudio() {
    renderModules();

    // Hero CTA
    const heroBtn = $('#gap-hero-cta');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        // ouvrir module image par défaut
        openModuleModal('image-ai');
        smoothScrollTo('#gap-modules');
      });
    }

    // Support quick-open via data attributes
    $$('[data-gap-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-gap-open');
        openModuleModal(id);
      });
    });

    // Keyboard ESC to close modal
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeModal();
    });

    // Small CSS additions to ensure loader animation exists
    injectGapstudioStyles();
  }

  /* -------------------------
     Utilities : smooth scroll
     ------------------------- */
  function smoothScrollTo(selector) {
    const elTarget = (typeof selector === 'string') ? document.querySelector(selector) : selector;
    if (!elTarget) return;
    elTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* -------------------------
     Small runtime CSS injection
     ------------------------- */
  function injectGapstudioStyles() {
    if ($('#gapstudio-runtime-styles')) return;
    const s = document.createElement('style');
    s.id = 'gapstudio-runtime-styles';
    s.textContent = `
      @keyframes gap-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      .gap-module-card button:hover { transform: translateY(-2px); }
      .gap-toast { transition: opacity .3s ease; }
    `;
    document.head.appendChild(s);
  }

  /* -------------------------
     Bootstrap when DOM ready
     ------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    try {
      initGapstudio();
    } catch (e) {
      console.error('Gapstudio init error', e);
    }
  });

  /* -------------------------
     Expose for debugging (optional)
     ------------------------- */
  window.GAPStudio = {
    MODULES,
    openModuleModal,
    openModulePreview,
    generate
  };

})();