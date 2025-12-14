// Charger la galerie
fetch("data/gallery.json")
    .then(res => res.json())
    .then(data => {
        window.GALLERY_DATA = data;
        populateFilters(data);
        renderGallery(data);
    });

function renderGallery(items) {
    const container = document.getElementById("galleryContainer");
    container.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        card.style.position = "relative";

        // Média + watermark GAP
        let media = "";
        if (item.type === "image") {
            media = `
                <div style="position:relative;">
                    <img src="${item.src}" class="gallery-media" />
                    <div class="gap-watermark">gap</div>
                </div>
            `;
        }
        else if (item.type === "audio") {
            media = `
                <audio controls src="${item.src}" style="width:100%;"></audio>
            `;
        }
        else if (item.type === "video") {
            media = `
                <div style="position:relative;">
                    <video controls src="${item.src}" style="width:100%;border-radius:10px;"></video>
                    <div class="gap-watermark">gap</div>
                </div>
            `;
        }

        // Actions like/comment/share
        const actions = `
            <div class="gallery-actions">
                <div class="gallery-action-btn" onclick="likeItem(${index})">
                    ❤️ <span id="like-count-${index}">0</span>
                </div>
                <div class="gallery-action-btn" onclick="commentItem(${index})">
                    💬 Commenter
                </div>
                <div class="gallery-action-btn" onclick="shareItem(${index}, '${item.src}')">
                    🔗 Partager
                </div>
            </div>
        `;

        card.innerHTML = `
            ${media}
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            ${actions}
            <div id="comments-${index}" class="comment-list"></div>
        `;

        container.appendChild(card);
    });
}

// Likes & commentaires
let likes = {};
let comments = {};

function likeItem(id) {
    likes[id] = (likes[id] || 0) + 1;
    document.getElementById(`like-count-${id}`).textContent = likes[id];
}

function commentItem(id) {
    const text = prompt("Écrire un commentaire :");
    if (!text) return;

    if (!comments[id]) comments[id] = [];
    comments[id].push(text);

    const list = document.getElementById(`comments-${id}`);
    list.innerHTML = comments[id].map(c => `<p>• ${c}</p>`).join("");
}

// Partage + watermark GAP
async function shareItem(id, src) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // important pour éviter les blocages
    img.src = src;

    img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        // Dessiner l'image originale
        ctx.drawImage(img, 0, 0);

        // Style watermark
        const watermark = "gap";
        const fontSize = Math.floor(canvas.width * 0.035); // taille proportionnelle
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = "rgba(138, 43, 226, 0.9)"; // Violet profond
        ctx.textBaseline = "bottom";

        // Position bas-droite (padding 20px)
        const textWidth = ctx.measureText(watermark).width;
        ctx.fillText(watermark, canvas.width - textWidth - 20, canvas.height - 20);

        // Convertir en fichier
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "gap_shared.jpg", { type: "image/jpeg" });

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Partagé depuis GlobalArtPro",
                        text: "Découvrez les cultures du monde sur GlobalArtPro.",
                        files: [file]
                    });
                } catch (e) {
                    console.log("Partage annulé", e);
                }
            } else {
                alert("Le partage n'est pas supporté sur cet appareil.");
            }
        }, "image/jpeg", 0.95);
    };

    img.onerror = () => {
        alert("Impossible de charger l'image pour le watermark.");
    };
}

// Filtres
function populateFilters(data) {
    let countries = new Set();
    let cultures = new Set();

    data.forEach(item => {
        if (item.country) countries.add(item.country);
        if (item.culture) cultures.add(item.culture);
    });

    const countrySelect = document.getElementById("filterCountry");
    const cultureSelect = document.getElementById("filterCulture");

    countries.forEach(c =>
        countrySelect.innerHTML += `<option value="${c}">${c}</option>`
    );

    cultures.forEach(c =>
        cultureSelect.innerHTML += `<option value="${c}">${c}</option>`
    );
}

document.querySelectorAll("select").forEach(sel => {
    sel.addEventListener("change", () => applyFilters());
});

function applyFilters() {
    let type = document.getElementById("filterType").value;
    let country = document.getElementById("filterCountry").value;
    let culture = document.getElementById("filterCulture").value;

    let filtered = window.GALLERY_DATA.filter(item => {
        return (
            (type === "all" || item.type === type) &&
            (country === "all" || item.country === country) &&
            (culture === "all" || item.culture === culture)
        );
    });

    renderGallery(filtered);
}