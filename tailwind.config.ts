import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // App Router
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}" // Pages Router (if using)
  ],
  theme: {
    screens: {
      xs: "480px",   // Custom extra-small screens
      sm: "640px",   // Default small
      md: "768px",   // Default medium
      lg: "1024px",  // Default large
      xl: "1280px",  // Default extra-large
      "2xl": "1536px", // Default 2xl
    },
    extend: {
      fontFamily: {
        syne: ['var(--font-loto)'],
      },
    },
  },
  plugins: [],
};

export default config;
