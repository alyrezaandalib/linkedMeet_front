import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000',
          light: '#eaf1ff',
          'dark-light': 'rgba(67,97,238,.15)',
        },
      },
    },
  },
  plugins: [],
};
export default config;

