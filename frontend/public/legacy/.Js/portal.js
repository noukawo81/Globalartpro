// Charger la galerie depuis JSON
async function loadGallery() {
  try {
    const response = await fetch("data/gallery.json");
    const items = await response.json();

    const gallery = document.getElementById("gallery-grid");
    gallery.innerHTML = "";

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "gallery-card";

      if (item.type === "image") {
        card.innerHTML = `
          <img src="${item.src}" alt="${item.title}">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        `;
      }

      if (item.type === "audio") {
        card.innerHTML = `
          <div class="audio-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <button onclick="playAudio('${item.src}')">Écouter</button>
          </div>
        `;
      }

      gallery.appendChild(card);
    });
  } catch (error) {
    console.error("Erreur chargement galerie:", error);
  }
}

// Mini-player audio
let currentAudio;

function playAudio(src) {
  if (currentAudio) {
    currentAudio.pause();
  }

  currentAudio = new Audio(src);
  currentAudio.play();
}

// Accès Premium (Acoin)
function enterPremium() {
  const hasAccess = localStorage.getItem("pi coin_access");

  if (hasAccess) {
    alert("Accès Premium déjà activé.");
    document.getElementById("premium-content").style.display = "block";
    return;
  }

  // Simulation du paiement (Acoin plus tard)
  const confirmation = confirm("Entrer avec 0,0005 pi coin ?");
  if (confirmation) {
    localStorage.setItem("pi coin_access", "true");
    document.getElementById("premium-content").style.display = "block";
    alert("Accès Premium activé.");
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
});