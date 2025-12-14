import React, { useState } from "react";
import { useParams } from "react-router-dom";

/* Mock Data - remplacera plus tard l’appel API */
const MOCK_PRODUCTS = {
  "1": {
    id: 1,
    title: "Sculpture Spirituelle — L’Ancêtre",
    artist: "Akom Tchatchouang",
    artistAvatar: "https://i.pravatar.cc/150?img=32",
    price: 189.99,
    description:
      "Œuvre artisanale unique représentant la force spirituelle du peuple Bamileke. Fabriquée à la main avec des matériaux nobles.",
    images: [
      "https://images.unsplash.com/photo-1556742040-675b27cd36b5",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6",
      "https://images.unsplash.com/photo-1535905748047-14b2415c3cfd",
    ],
    variants: {
      sizes: ["Petit", "Moyen", "Grand"],
      colors: ["Bois", "Bronze", "Noir"],
    },
    category: "Sculpture",
  },
};

/* ------------------------ COMPONENT ------------------------ */

export default function ProductPage() {
  const { id } = useParams();
  const product = MOCK_PRODUCTS[id];

  const [selectedImage, setSelectedImage] = useState(
    product?.images[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Produit introuvable</h2>
        <p>Vérifie l’URL ou sélectionne un autre article.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* -------- LEFT: Image gallery -------- */}
      <div style={styles.gallery}>
        <img
          src={selectedImage}
          alt={product.title}
          style={styles.mainImage}
        />

        <div style={styles.thumbnailContainer}>
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              style={{
                ...styles.thumbnail,
                border:
                  selectedImage === img ? "2px solid #333" : "1px solid #ddd",
              }}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* -------- RIGHT: Product details -------- */}
      <div style={styles.details}>
        <h1 style={styles.title}>{product.title}</h1>

        {/* Artist */}
        <div style={styles.artistBox}>
          <img
            src={product.artistAvatar}
            alt={product.artist}
            style={styles.artistAvatar}
          />
          <div>
            <strong>{product.artist}</strong>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
              Artiste certifié GlobalArtPro
            </p>
          </div>
        </div>

        <p style={styles.description}>{product.description}</p>

        <h2 style={styles.price}>{product.price} €</h2>

        {/* Variantes */}
        <div style={styles.variantGroup}>
          <p style={styles.variantLabel}>Taille :</p>
          <div style={styles.variantOptions}>
            {product.variants.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  ...styles.variantButton,
                  background:
                    selectedSize === size ? "#222" : "transparent",
                  color: selectedSize === size ? "#fff" : "#222",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.variantGroup}>
          <p style={styles.variantLabel}>Couleur :</p>
          <div style={styles.variantOptions}>
            {product.variants.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{
                  ...styles.variantButton,
                  background:
                    selectedColor === color ? "#222" : "transparent",
                  color: selectedColor === color ? "#fff" : "#222",
                }}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button style={styles.addToCart}>Ajouter au panier</button>
      </div>
    </div>
  );
}

/* ------------------------ STYLES ------------------------ */

const styles = {
  container: {
    display: "flex",
    gap: 40,
    padding: "40px 60px",
    alignItems: "flex-start",
  },
  gallery: {
    flex: 1,
  },
  mainImage: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 12,
  },
  thumbnailContainer: {
    display: "flex",
    gap: 12,
  },
  thumbnail: {
    width: 70,
    height: 70,
    objectFit: "cover",
    borderRadius: 8,
    cursor: "pointer",
  },

  details: {
    flex: 1,
    paddingRight: 30,
  },
  title: {
    marginTop: 0,
    fontSize: 32,
    fontWeight: 700,
  },
  description: {
    fontSize: 15,
    lineHeight: "1.6em",
    opacity: 0.85,
  },
  price: {
    marginTop: 10,
    fontSize: 28,
    color: "#222",
  },

  artistBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0 20px 0",
  },
  artistAvatar: {
    width: 45,
    height: 45,
    borderRadius: "50%",
  },

  variantGroup: {
    marginTop: 20,
  },
  variantLabel: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  variantOptions: {
    display: "flex",
    gap: 10,
  },
  variantButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #222",
    cursor: "pointer",
    transition: "0.2s",
  },

  addToCart: {
    marginTop: 30,
    padding: "14px 30px",
    backgroundColor: "#222",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
    width: "100%",
  },
};