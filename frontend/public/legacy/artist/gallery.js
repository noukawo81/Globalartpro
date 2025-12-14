// MODE SOMBRE
const toggle = document.getElementById("darkToggle");
toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    toggle.textContent = document.body.classList.contains("dark")
        ? "Mode clair" : "Mode sombre";
});


// BASE DE DONNÉES INTERNES (API SIMULÉE)
const artworks = [
    {
        title: "Temple Japonais",
        img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Kinkaku-ji_in_Kyoto.jpg",
        category: "japonais",
        continent: "asie"
    },
    {
        title: "Art numérique futuriste",
        img: "https://images.unsplash.com/photo-1542751110-97427bbecf20",
        category: "art-numerique",
        continent: "europe"
    },
    {
        title: "Masque Africain",
        img: "https://upload.wikimedia.org/wikipedia/commons/7/7f/African_mask_Luba.jpg",
        category: "africain",
        continent: "afrique"
    },
    {
        title: "Peinture à l’huile",
        img: "https://images.unsplash.com/photo-1504198266285-165a16a1adfa",
        category: "peinture",
        continent: "amerique"
    },
    {
        title: "Musée 3D",
        img: "https://images.unsplash.com/photo-1581091870627-3a5c6e0fcb36",
        category: "musee3d",
        continent: "europe"
    },
    {
        title: "Art Chinois",
        img: "https://upload.wikimedia.org/wikipedia/commons/1/10/Forbidden_City_Beijing_Sunset.jpg",
        category: "chinois",
        continent: "asie"
    },
    {
        title: "Art Indien",
        img: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Taj_Mahal_in_March_2004.jpg",
        category: "indien",
        continent: "asie"
    },
    {
        title: "Art Russe",
        img: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Moscow_Morning_Scene_2017.jpg",
        category: "russe",
        continent: "europe"
    }
];


// INJECTION AUTOMATIQUE
function loadGallery() {
    const category = document.getElementById("categoryFilter").value;
    const continent = document.getElementById("continentFilter").value;

    const container = document.getElementById("galleryContainer");
    container.innerHTML = "";

    artworks
        .filter(a =>
            (category === "all" || a.category === category) &&
            (continent === "all" || a.continent === continent)
        )
        .forEach(a => {
            const div = document.createElement("div");
            div.className = "gallery-item";
            div.innerHTML = `<img src="${a.img}" alt="${a.title}">`;
            div.onclick = () => openLightbox(a.img);
            container.appendChild(div);
        });
}

document.getElementById("categoryFilter").onchange = loadGallery;
document.getElementById("continentFilter").onchange = loadGallery;

loadGallery();


// LIGHTBOX
function openLightbox(src) {
    const light = document.getElementById("lightbox");
    document.getElementById("lightbox-img").src = src;
    light.style.display = "flex";

    light.onclick = () => {
        light.style.display = "none";
    };
}