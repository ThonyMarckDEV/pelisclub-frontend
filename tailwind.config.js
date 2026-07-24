/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC700', // Amarillo pato
          hover: '#E6B300',   // Amarillo pato oscuro (Hover)
          light: '#FFF3C4',   // Amarillo pálido (Fondos suaves)
        },
        secondary: {
          DEFAULT: '#0A0A0A', // Negro profundo
          text: '#18181b',    // Zinc-900 (Texto legible)
          muted: '#71717a',   // Zinc-500 (Textos secundarios)
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        elegant: '0 20px 60px -15px rgba(0,0,0,0.5)',
        'elegant-gold': '0 0 0 1px rgba(255,199,0,0.35), 0 20px 60px -15px rgba(0,0,0,0.6)',
      }
    }
  },
  plugins: [],
}