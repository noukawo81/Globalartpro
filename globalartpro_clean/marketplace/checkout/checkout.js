document.addEventListener("DOMContentLoaded", () => {
    // Récupération des paramètres passés dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get("name");
    const productPrice = urlParams.get("price");
    const productImg = urlParams.get("img");

    const productContainer = document.getElementById("productSummary");

    // Si aucune info dans l'URL → on renvoie à la marketplace
    if (!productName || !productPrice) {
        productContainer.innerHTML = "<p>Produit introuvable. Retour à la marketplace...</p>";
        setTimeout(() => window.location.href = "../marketplace.html", 2000);
        return;
    }

    // Affichage du produit dans checkout
    productContainer.innerHTML = `
        <div class="checkout-product">
            <img src="${productImg}" alt="${productName}">
            <div>
                <h3>${productName}</h3>
                <p class="price">${productPrice} pi</p>
            </div>
        </div>
    `;

    // Gestion du formulaire de paiement
    const checkoutForm = document.getElementById("checkoutForm");

    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!fullname || !email || !address || !phone) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Simule un paiement traité
        alert(
            "Merci pour votre achat !\n\n" +
            "Produit : " + productName + "\n" +
            "Montant : " + productPrice + " pi\n\n" +
            "Votre commande est en préparation."
        );

        // Retour à la marketplace
        window.location.href = "../marketplace.html";
    });
});