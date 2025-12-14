/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        gradientBG: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        starFloat: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(-30px)' },
        },
      },
      animation: {
        gradientBG: "gradientBG 8s ease-in-out infinite alternate",
        fadeIn: "fadeIn 2s 0.5s forwards",
        starFloat: "starFloat var(--star-duration,5s) ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};