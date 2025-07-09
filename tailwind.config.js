/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        secondary: "#1E3A5F",
        accent: "#00D084",
        surface: "#2C3E50",
        background: "#0F1419",
        success: "#00D084",
        warning: "#FFC107",
        error: "#DC3545",
        info: "#17A2B8",
        gray: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A"
        }
      },
      fontFamily: {
        display: ["Bebas Neue", "Impact", "Arial Black", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem"
      },
      animation: {
        "pulse-red": "pulse-red 1s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out"
      },
      keyframes: {
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(220, 53, 69, 0.7)" },
          "50%": { boxShadow: "0 0 0 10px rgba(220, 53, 69, 0)" }
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        }
      }
    },
  },
  plugins: [],
}