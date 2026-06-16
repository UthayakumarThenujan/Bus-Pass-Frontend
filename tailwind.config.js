/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#DB2777",
        background: "#F3F4F6",
        surface: "#FFFFFF",
        textPrimary: "#111827",
        textSecondary: "#4B5563"
      }
    },
  },
  plugins: [],
}
