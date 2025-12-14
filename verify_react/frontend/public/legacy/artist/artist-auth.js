// AFFICHAGE DES ONGLETS
function showSignup() {
    document.getElementById("signupForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("tabSignup").classList.add("active");
    document.getElementById("tabLogin").classList.remove("active");
}

function showLogin() {
    document.getElementById("signupForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("tabSignup").classList.remove("active");
    document.getElementById("tabLogin").classList.add("active");
}


// INSCRIPTION
document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = {
        nom: document.getElementById("regLastName").value.trim(),
        prenom: document.getElementById("regFirstName").value.trim(),
        email: document.getElementById("regEmail").value.trim(),
        pass: document.getElementById("regPass").value.trim(),
        bio: document.getElementById("regBio").value.trim(),
        role: document.getElementById("regRole").value,
        createdAt: new Date().toISOString()
    };

    let users = JSON.parse(localStorage.getItem("GAP_users")) || [];

    if (users.some(u => u.email === user.email)) {
        alert("Un compte avec cet email existe déjà.");
        return;
    }

    users.push(user);
    localStorage.setItem("GAP_users", JSON.stringify(users));

    alert("Compte créé avec succès. Connectez-vous.");
    showLogin();
});


// CONNEXION
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    let users = JSON.parse(localStorage.getItem("GAP_users")) || [];

    const user = users.find(u => u.email === email && u.pass === pass);

    if (!user) {
        alert("Identifiants incorrects");
        return;
    }

    localStorage.setItem("GAP_loggedUser", JSON.stringify(user));

    // REDIRECTION PROPRE
    window.location.href = "artist-dashboard.html";
});