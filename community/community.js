// module pattern
const POSTS_JSON = "./community_posts.json";

let POSTS = [];
const feedEl = document.getElementById("feed");
const filterCountry = document.getElementById("filterCountry");
const filterType = document.getElementById("filterType");
const postText = document.getElementById("postText");
const postMedia = document.getElementById("postMedia");
const btnPublish = document.getElementById("btnPublish");
const lightbox = document.getElementById("lightbox");
const lbMedia = document.getElementById("lbMedia");
const lbTitle = document.getElementById("lbTitle");
const lbText = document.getElementById("lbText");
const lbClose = document.getElementById("lbClose");

// in-memory data (MVP)
async function loadPosts(){
  try{
    const r = await fetch(POSTS_JSON);
    POSTS = await r.json();
    buildCountryFilter();
    renderFeed(POSTS);
  }catch(e){
    console.error("Erreur chargement posts:", e);
  }
}

function buildCountryFilter(){
  const set = new Set(POSTS.map(p => p.country).filter(Boolean));
  set.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    filterCountry.appendChild(opt);
  });
}

// render
function renderFeed(list){
  feedEl.innerHTML = "";
  list.slice().reverse().forEach(post => {
    const postEl = document.createElement("article");
    postEl.className = "post";

    const mediaHtml = (post.type === "image" && post.media) ?
      `<div class="media"><img src="${post.media}" loading="lazy" alt="${escapeHtml(post.title||'')}" /></div>` :
      (post.type === "video" && post.media ? `<div class="media"><video src="${post.media}" controls></video></div>` : "");

    postEl.innerHTML = `
      <div class="meta">
        <strong>${escapeHtml(post.title||'')}</strong>
        <div class="text">${escapeHtml(post.text||'')}</div>
        ${mediaHtml}
        <div class="actions">
          <button class="action-btn" data-like="${post.id}">❤️ <span class="count">${post.likes||0}</span></button>
          <button class="action-btn" data-comment="${post.id}">💬 <span class="count">${(post.comments||[]).length}</span></button>
          <button class="action-btn" data-share="${post.id}">🔗 Share</button>
        </div>
        <div class="comment-list" id="comments-${post.id}">${renderCommentsHtml(post.comments || [])}</div>
      </div>
    `;

    // events
    postEl.querySelectorAll("[data-like]").forEach(btn => btn.addEventListener("click", e => {
      const id = Number(e.currentTarget.dataset.like); likePost(id, e.currentTarget);
    }));
    postEl.querySelectorAll("[data-comment]").forEach(btn => btn.addEventListener("click", e => {
      const id = Number(e.currentTarget.dataset.comment); commentPostPrompt(id);
    }));
    postEl.querySelectorAll("[data-share]").forEach(btn => btn.addEventListener("click", e => {
      const id = Number(e.currentTarget.dataset.share); sharePost(id);
    }));

    // click to open media larger
    const img = postEl.querySelector(".meta .media img");
    if(img) img.addEventListener("click", ()=> openLightbox(post));

    feedEl.appendChild(postEl);
  });
}

function renderCommentsHtml(comments){
  if(!comments || comments.length===0) return "<em style='color:var(--muted)'>Aucun commentaire</em>";
  return comments.map(c => `<p>${escapeHtml(c)}</p>`).join("");
}

// actions
function likePost(id, btn){
  const p = POSTS.find(x=>x.id===id);
  if(!p) return;
  p.likes = (p.likes||0) + 1;
  // update UI (btn)
  if(btn) btn.querySelector(".count").textContent = p.likes;
  // also update feed (counts)
  renderFeed(applyFilters());
}

function commentPostPrompt(id){
  const text = prompt("Écrire un commentaire :");
  if(!text) return;
  const p = POSTS.find(x=>x.id===id);
  if(!p) return;
  p.comments = p.comments || [];
  p.comments.push(text);
  renderFeed(applyFilters());
}

async function sharePost(id){
  const p = POSTS.find(x=>x.id===id);
  if(!p) return alert("Post introuvable");
  if(p.type === "image" && p.media){
    await shareImageWithWatermark(p.media, p.title || "Shared from GlobalArtPro");
  } else {
    // pour texte/vidéo/audio on propose une copie du texte + lien (MVP)
    if(navigator.share){
      try{
        await navigator.share({title: p.title||"GlobalArtPro", text: p.text||"", url: p.media || ""});
      }catch(e){ console.log("partage annulé", e) }
    } else {
      copyToClipboard(`${p.title||''}\n${p.text||''}\n${p.media||''}`);
      alert("Contenu copié (coller pour partager)");
    }
  }
}

// watermark: download image, draw on canvas, share or save
async function shareImageWithWatermark(url, title){
  try{
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    await imageLoaded(img);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // maintain reasonable size to limit memory
    const maxW = 1600;
    const scale = Math.min(1, maxW / img.width);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // watermark styling (gap violet bottom-right)
    const watermark = "gap";
    const fontSize = Math.max(14, Math.round(canvas.width * 0.04));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(106,17,203,0.95)"; // violet
    const textWidth = ctx.measureText(watermark).width;
    const padding = Math.round(canvas.width * 0.03);
    const x = canvas.width - textWidth - padding;
    const y = canvas.height - padding;
    // shadow for readability
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillText(watermark, x+2, y+2);
    ctx.fillStyle = "rgba(106,17,203,0.95)";
    ctx.fillText(watermark, x, y);

    // produce blob
    const blob = await new Promise(res => canvas.toBlob(res, "image/jpeg", 0.92));

    const file = new File([blob], "globalartpro_shared.jpg", { type: "image/jpeg" });

    if(navigator.canShare && navigator.canShare({ files: [file] })){
      try{
        await navigator.share({ title, files: [file], text: "Shared from GlobalArtPro" });
      }catch(e){
        console.log("share cancelled", e);
      }
    } else {
      // fallback: download
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob; a.download = "globalartpro_shared.jpg"; document.body.appendChild(a); a.click();
      a.remove(); URL.revokeObjectURL(urlBlob);
      alert("Image téléchargée avec watermark (fichier).");
    }
  }catch(err){
    console.error("Erreur partage:", err);
    alert("Impossible de partager l'image (CORS ou origine distante).");
  }
}

// helpers
function imageLoaded(img){
  return new Promise((res, rej) => {
    img.onload = () => res(img);
    img.onerror = e => rej(e);
  });
}
function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]); }
function copyToClipboard(text){ navigator.clipboard?.writeText(text).catch(()=>{}); }

// publish (client-side only)
btnPublish.addEventListener("click", async ()=>{
  const text = postText.value.trim();
  const file = postMedia.files[0];
  let mediaUrl = "";
  let type = "text";

  if(file){
    // read local file as data url (keeps within MVP)
    const reader = new FileReader();
    mediaUrl = await new Promise((res,rej)=>{
      reader.onload = ()=>res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
    if(file.type.startsWith("image/")) type = "image";
    else if(file.type.startsWith("video/")) type = "video";
    else if(file.type.startsWith("audio/")) type = "audio";
  } else if(text) {
    type = "text";
  } else {
    return alert("Veuillez ajouter un texte ou un média.");
  }

  const newPost = {
    id: Date.now(),
    type,
    title: (text.length>40)? text.slice(0,38)+"…": text || "Publication",
    text,
    media: mediaUrl,
    country: "Local",
    likes: 0,
    comments: []
  };
  POSTS.push(newPost);
  // reset composer
  postText.value = ""; postMedia.value = "";
  renderFeed(applyFilters());
  // scroll to top of feed
  window.scrollTo({top:0,behavior:"smooth"});
});

// filters
filterCountry.addEventListener("change", ()=> renderFeed(applyFilters()));
filterType.addEventListener("change", ()=> renderFeed(applyFilters()));

function applyFilters(){
  const country = filterCountry.value || "all";
  const type = filterType.value || "all";
  return POSTS.filter(p=>{
    return (country==="all" || (p.country||"").toLowerCase()===country.toLowerCase()) &&
           (type==="all" || p.type===type);
  });
}

// Lightbox
function openLightbox(post){
  lbMedia.innerHTML = "";
  if(post.type==="image"){
    const img = document.createElement("img"); img.src = post.media; lbMedia.appendChild(img);
  } else if(post.type==="video"){
    const v = document.createElement("video"); v.src = post.media; v.controls=true; lbMedia.appendChild(v);
  } else if(post.type==="audio"){
    const a = document.createElement("audio"); a.src = post.media; a.controls=true; lbMedia.appendChild(a);
  }
  lbTitle.textContent = post.title || "";
  lbText.textContent = post.text || "";
  lightbox.classList.remove("hidden");
}
lbClose.addEventListener("click", ()=> lightbox.classList.add("hidden"));

// startup
loadPosts();