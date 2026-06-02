

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "hsl(217, 91%, 50%)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "hsl(160, 84%, 29%)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--text-muted)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--text-main)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          hover: "hsl(0, 84%, 50%)",
        },
        sidebar: "var(--text-main)",
        "sidebar-bg": "var(--sidebar-bg)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      }
    },
  },
  plugins: [],
}

