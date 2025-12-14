 // --- Pi Network & NFT Simulation ---
// Connexion au wallet Pi
function connectPiWallet() {
    alert("Connexion au wallet Pi en cours...");
    console.log("Wallet Pi connecté (simulation).");
}

// Création d'un NFT
function createPiNFT(title, desc) {
    if (!title || !desc) {
        alert("Titre et description requis !");
        return;
    }
    alert(`Création de l'œuvre NFT :\nTitre : ${title}\nDescription : ${desc}`);
    console.log("NFT créé (simulation)", { title, desc });
}

// Achat d'un NFT
function buyPiNFT(nftId) {
    if (!nftId) {
        alert("ID requis !");
        return;
    }
    alert(`Achat de l'œuvre NFT avec l'ID : ${nftId}`);
    console.log("NFT acheté (simulation)", { nftId });
}

// Générer un certificat numérique
function generateCertificate() {
    const artist = prompt("Nom de l'artiste :");
    const artwork = prompt("Titre de l'œuvre :");
    if (artist && artwork) {
        alert(`Certificat généré pour ${artist} - "${artwork}"`);
        console.log("Certificat généré (simulation)", { artist, artwork });
    }
}

// Voir l'historique de propriété NFT
function showNFTHistory() {
    const nftId = prompt("ID de l'œuvre NFT :");
    if (nftId) {
        alert(`Historique de propriété pour NFT #${nftId} :\n- Créé par Artiste X\n- Vendu à Utilisateur Y\n- ... (simulation)`);
        console.log("Historique NFT (simulation)", { nftId });
    }
}

// Scanner RA (placeholder)
function showScanner() {
    alert("Fonction Scanner RA à venir !");
}

// Challenges créatifs (placeholder)
function showChallenges() {
    alert("Section Challenges créatifs à venir !");
}

// Dashboard Analytics (placeholder)
function showDashboard() {
    alert("Dashboard Analytics à venir !");
}

// Suggestions personnalisées (placeholder)
function showSuggestions() {
    document.getElementById("suggestedArtworks").innerHTML = "<p>Suggestions IA à venir...</p>";
}

// Gamification (placeholder)
function showBadges() {
    document.getElementById("userBadges").innerHTML = "<p>Badges et points à venir...</p>";
}

// --- Liaison des boutons après chargement du DOM ---
window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnConnectPi").onclick = connectPiWallet;
    document.getElementById("btnCreateNFT").onclick = function() {
        const title = prompt("Titre de l'œuvre :");
        const desc = prompt("Description :");
        createPiNFT(title, desc);
    };
    document.getElementById("btnBuyNFT").onclick = function() {
        const nftId = prompt("ID de l'œuvre à acheter :");
        buyPiNFT(nftId);
    };
    document.getElementById("btnCertificate").onclick = generateCertificate;
    document.getElementById("btnHistory").onclick = showNFTHistory;
    document.getElementById("btnScanner").onclick = showScanner;
    document.getElementById("btnChallenges").onclick = showChallenges;
    document.getElementById("btnDashboard").onclick = showDashboard;
    showSuggestions();
    showBadges();
});
window.buyPiNFT = buyPiNFT;