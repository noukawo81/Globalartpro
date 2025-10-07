import React from "react";
import Link from "next/link";

// Typage des props pour SocialIcon
type SocialIconProps = {
  href: string;
  children: React.ReactNode;
  label: string;
};

const SocialIcon = ({ href, children, label }: SocialIconProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="mx-2 hover:scale-110 transition-transform"
  >
    {children}
  </a>
);

// Animation utilitaire Tailwind (à ajouter dans tailwind.config.js si tu veux plus d'effets)
const gradientAnimation = "animate-[gradientBG_8s_ease-in-out_infinite_alternate]";
const fadeInAnimation = "animate-[fadeIn_2s_0.5s_forwards]";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-black relative overflow-hidden">
      {/* Effet fond animé */}
      <div className={`absolute inset-0 z-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black w-full h-full blur-sm ${gradientAnimation}`} />

      {/* Particules étoiles */}
      <Particles />

      {/* Héros */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] pt-24 pb-12">
        <h1
          className="text-5xl md:text-6xl font-extrabold text-white text-center mb-6 drop-shadow-[0_0_24px_gold]"
          style={{ textShadow: "0 0 24px #ffd700, 0 0 8px #fff" }}
        >
          🌌 Bienvenue dans <span className="text-yellow-400">GAP Studio IA</span>
        </h1>
        <p className={`text-xl md:text-2xl text-gray-100 mb-10 text-center max-w-2xl opacity-0 ${fadeInAnimation}`}>
          Plonge dans une expérience artistique et technologique unique.<br />
          Fusionne ton imagination avec la puissance de l’IA créative.
        </p>
        <Link
          href="/gapstudio"
          className="relative inline-block px-10 py-4 text-xl font-bold rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform animate-bounce"
          style={{ boxShadow: "0 0 24px #ffd70088" }}
        >
          🎨 Entrer dans le Studio
        </Link>
      </section>

      {/* Section À propos */}
      <section className="relative z-10 bg-black bg-opacity-70 rounded-3xl mx-auto max-w-3xl p-8 mt-8 mb-8 shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">À propos du Studio</h2>
        <p className="text-gray-200 text-center mb-8">
          <span className="text-yellow-300 font-semibold">GAP Studio IA</span> est un espace créatif alimenté par l’intelligence artificielle.<br />
          Ici, les artistes fusionnent technologie et imagination pour donner vie à des œuvres uniques.<br />
          Génère des visuels, de la musique, de la poésie ou des sculptures numériques… tout devient possible.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/creations" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-500 text-gray-900 font-bold shadow-lg hover:scale-105 hover:text-white transition">Découvrir les Créations</Link>
          <Link href="/communaute" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-500 text-gray-900 font-bold shadow-lg hover:scale-105 hover:text-white transition">Rejoindre la Communauté</Link>
          <Link href="/apprendre" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-500 text-gray-900 font-bold shadow-lg hover:scale-105 hover:text-white transition">Apprendre à créer avec l’IA</Link>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="relative z-10 bg-black bg-opacity-90 py-6 flex flex-col items-center">
        <div className="flex mb-2">
          <SocialIcon href="https://facebook.com" label="Facebook">
            <svg width="28" height="28" fill="currentColor" className="text-gray-400 hover:text-blue-500"><path d="M19 3h-3a5 5 0 0 0-5 5v3H8v4h3v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z"/></svg>
          </SocialIcon>
          <SocialIcon href="https://instagram.com" label="Instagram">
            <svg width="28" height="28" fill="currentColor" className="text-gray-400 hover:text-pink-500"><circle cx="14" cy="14" r="10"/><circle cx="14" cy="14" r="4"/><circle cx="19" cy="9" r="1.5"/></svg>
          </SocialIcon>
          <SocialIcon href="https://x.com" label="X">
            <svg width="28" height="28" fill="currentColor" className="text-gray-400 hover:text-white"><path d="M7 7l14 14M21 7L7 21"/></svg>
          </SocialIcon>
          <SocialIcon href="https://youtube.com" label="YouTube">
            <svg width="28" height="28" fill="currentColor" className="text-gray-400 hover:text-red-500"><rect x="6" y="10" width="16" height="8" rx="2"/><polygon points="12,12 18,14 12,16"/></svg>
          </SocialIcon>
        </div>
        <div className="text-gray-400 text-sm text-center">
          © 2025 GlobalArtPro — Propulsé par <span className="text-yellow-400">GAP Studio IA</span>
        </div>
      </footer>
    </div>
  );
}

// Composant Particules (poussière d’étoiles) 100% Tailwind
function Particles() {
  // Génère 60 particules aléatoires
  const stars = Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const size = 1 + Math.random() * 2.5;
    const duration = 3 + Math.random() * 7;
    return (
      <span
        key={i}
        className="absolute rounded-full pointer-events-none"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          background: "radial-gradient(circle,#fff,#ffd70088 70%,transparent 100%)",
          opacity: 0.7 + Math.random() * 0.3,
          filter: "blur(0.5px)",
          animation: `starFloat ${duration}s ease-in-out infinite alternate`,
        }}
      />
    );
  });
  return (
    <div className="absolute inset-0 z-1 pointer-events-none">
      {stars}
      {/* Ajoute les keyframes dans Tailwind config pour starFloat et gradientBG si tu veux l’animation */}
    </div>
  );
}