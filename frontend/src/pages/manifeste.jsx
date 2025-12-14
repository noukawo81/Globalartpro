import React from "react";

export default function Manifeste() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manifeste GlobalArtPro</h1>

      <p style={styles.paragraph}>
        GlobalArtPro est une plateforme internationale dédiée à l’expression, à
        la valorisation et à la circulation mondiale de l’art. Nous réunissons
        artistes, collectionneurs, institutions culturelles et amoureux de
        créativité dans un écosystème où chaque œuvre et chaque culture trouve
        sa place.
      </p>

      <h2 style={styles.subtitle}>Notre Vision</h2>
      <p style={styles.paragraph}>
        Nous croyons en un monde où l’art n’est pas seulement un produit, mais
        une puissance sociale, culturelle et économique. Notre ambition est de
        bâtir une passerelle universelle reliant les artistes du monde entier aux
        marchés globaux, aux musées, aux entreprises et au public international.
      </p>

      <h2 style={styles.subtitle}>Notre Mission</h2>
      <ul style={styles.list}>
        <li>
          Offrir une vitrine mondiale aux artistes émergents et confirmés,
          indépendamment de leur origine.
        </li>
        <li>
          Permettre la vente d’œuvres physiques, numériques et hybrides à
          travers une plateforme sécurisée et accessible.
        </li>
        <li>
          Intégrer les musées internationaux pour exposer, valoriser et protéger
          le patrimoine artistique mondial.
        </li>
        <li>
          Développer une économie créative moderne grâce à notre cryptomonnaie,
          l’ArtCoin, utilisée pour les transactions internes.
        </li>
      </ul>

      <h2 style={styles.subtitle}>Notre Engagement envers les Artistes</h2>
      <p style={styles.paragraph}>
        GlobalArtPro assure un environnement équitable, transparent et innovant,
        où chaque créateur conserve la propriété de son œuvre. Nous nous
        engageons à maximiser leur visibilité et leurs revenus grâce à :
      </p>

      <ul style={styles.list}>
        <li>
          Un studio créatif IA (GAPstudio) pour générer, améliorer ou
          transformer des créations.
        </li>
        <li>
          Un accès direct aux musées partenaires.
        </li>
        <li>
          Des outils avancés de marketing et de promotion.
        </li>
        <li>
          La possibilité de tokeniser leurs œuvres en NFT.
        </li>
      </ul>

      <h2 style={styles.subtitle}>Notre Technologie</h2>
      <p style={styles.paragraph}>
        L’écosystème GlobalArtPro s’appuie sur une architecture moderne :
      </p>

      <ul style={styles.list}>
        <li>Une place de marché ultra-optimisée pour l’art physique et digital.</li>
        <li>Un système biométrique anti-fraude (Orbix) pour sécuriser les comptes.</li>
        <li>Une cryptomonnaie dédiée aux frais de transaction (ArtCoin).</li>
        <li>
          Une API ouverte pour connecter musées, galeries et entreprises
          partenaires.
        </li>
      </ul>

      <h2 style={styles.subtitle}>Notre Engagement Culturel</h2>
      <p style={styles.paragraph}>
        Nous défendons la diversité culturelle mondiale. Chaque continent, chaque
        tradition, chaque héritage trouve sa voix sur GlobalArtPro. Nous voulons
        représenter les cultures non pas comme des décorations, mais comme des
        forces vivantes qui façonnent l’humanité.
      </p>

      <h2 style={styles.subtitle}>Un Pont vers l’Avenir</h2>
      <p style={styles.paragraph}>
        GlobalArtPro est plus qu’une plateforme : c’est une révolution culturelle
        et technologique. Nous construisons aujourd’hui l’infrastructure qui
        permettra aux artistes de demain de rayonner à l’échelle planétaire.
      </p>

      <p style={styles.footer}>
        GlobalArtPro — Unir l’art, les cultures et les technologies pour
        transformer le monde.
      </p>
    </div>
  );
}

// Styles simples pour intégration rapide
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif",
    lineHeight: "1.6",
    color: "#222",
  },
  title: {
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "28px",
    fontWeight: "600",
    marginTop: "30px",
    marginBottom: "10px",
  },
  paragraph: {
    fontSize: "18px",
    marginBottom: "15px",
  },
  list: {
    marginLeft: "20px",
    marginBottom: "20px",
    fontSize: "18px",
  },
  footer: {
    marginTop: "40px",
    fontSize: "20px",
    fontWeight: "600",
    textAlign: "center",
  },
};