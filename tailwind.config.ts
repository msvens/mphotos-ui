import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // MUI Dark theme colors
        mui: {
          primary: '#90caf9',
          secondary: '#ce93d8',
          background: {
            paper: '#121212',
            default: '#121212',
            hover: '#2c2c2c'
          },
          divider: 'rgba(255, 255, 255, 0.15)',
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.85)',
            disabled: 'rgba(255, 255, 255, 0.5)',
          }
        },
      },
    },
  },
  plugins: [],
};

export default config;
