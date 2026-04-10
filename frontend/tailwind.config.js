
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        background: "hsl(210, 40%, 98%)", // #F2F6F9
        primary: {
          DEFAULT: "hsl(217, 91%, 60%)", // #3B82F6
          hover: "hsl(217, 91%, 50%)",
        },
        accent: {
          DEFAULT: "hsl(160, 84%, 39%)", // #10BD83
          hover: "hsl(160, 84%, 29%)",
        },
        muted: {
          DEFAULT: "hsl(210, 20%, 95%)", // #F0F4F8
          foreground: "hsl(215, 16%, 47%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)", // #FFFFFF
          foreground: "hsl(222, 47%, 11%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)", // #F63B3B
          hover: "hsl(0, 84%, 50%)",
        },
        sidebar: "hsl(222, 47%, 11%)", // #0F172A
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
