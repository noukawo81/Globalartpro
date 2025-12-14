// ==========================
// CHARGEMENT DES DONNÉES
// ==========================
const productListEl = document.getElementById("productList");
const categoryListEl = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");

let allProducts = [];
let allCategories = [];
let filteredProducts = [];

// Charger marketplace.json
async function loadMarketplace() {
    try {
        const response = await  fetch("../data/marketplace.json")
        allProducts = await response.json();
        filteredProducts = allProducts;

        extractCategories();
        renderCategories();
        renderProducts(allProducts);
    } catch (error) {
        console.error("Erreur chargement marketplace.json :", error);
    }
}
// ==========================
// EXTRACTION DES CATÉGORIES
// ==========================
function extractCategories() {
    const categories = new Set();
    allProducts.forEach(p => categories.add(p.category));
    allCategories = ["Tous", ...categories];
}

// ==========================
// AFFICHER LES CATÉGORIES
// ==========================
function renderCategories() {
    categoryListEl.innerHTML = "";

    allCategories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "category-btn";
        btn.textContent = cat;

        btn.addEventListener("click", () => filterByCategory(cat));

        categoryListEl.appendChild(btn);
    });
}

// ==========================
// FILTRE PAR CATÉGORIE
// ==========================
function filterByCategory(category) {
    if (category === "Tous") {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    renderProducts(filteredProducts);
}

// ==========================
// RECHERCHE
// ==========================
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    const results = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(keyword) ||
        product.artist.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
    );

    renderProducts(results);
});

// ==========================
// AFFICHAGE DES PRODUITS
// ==========================
function renderProducts(products) {
    productListEl.innerHTML = "";

    if (products.length === 0) {
        productListEl.innerHTML = `<p class="no-result">Aucun produit trouvé.</p>`;
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const media = product.type === "image"
            ? `<img src="${product.src}" alt="${product.title}">`
            : product.type === "audio"
                ? `<audio controls src="${product.src}"></audio>`
                : product.type === "video"
                    ? `<video controls src="${product.src}"></video>`
                    : "";

        card.innerHTML = `
            <div class="product-media">${media}</div>
            <h3>${product.title}</h3>
            <p class="artist">${product.artist}</p>
            <p class="description">${product.description}</p>
            <p class="price">${product.price} FCFA</p>
            <button class="buy-btn">Acheter</button>
        `;

        productListEl.appendChild(card);
    });
}

// Lancer au chargement
document.addEventListener("DOMContentLoaded", loadMarketplace);