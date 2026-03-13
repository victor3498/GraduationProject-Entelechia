/** @type {import('tailwindcss').Config} */
export default {
  
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ======================
         Color System
      ====================== */

      colors: {

        /* Brand Red */

        brand: {
          50: "#FAD7D2",
          100: "#F6AAA1",
          200: "#F07A6E",
          300: "#E8564B",
          400: "#D63A32",
          500: "#C72C2C",
          600: "#B3282B",
          700: "#8F1D20",
          800: "#6A0F13",
          900: "#3B0608"
        },

        /* Neutral Dark UI */

        neutral: {
          50: "#F5F5F5",
          100: "#EDEDED",
          200: "#D1D1D1",
          300: "#9E9E9E",
          400: "#6B6B6B",
          500: "#3E3E3E",
          600: "#2A2A2A",
          700: "#222222",
          800: "#1C1C1C",
          900: "#0E0E0E"
        },

        /* Accent Gold */

        accent: {
          gold: "#C8A96A",
          darkGold: "#9C7A3E"
        },

        /* Semantic */

        success: "#3FB950",
        warning: "#D29922",
        error: "#F85149",
        info: "#58A6FF"
      },

      /* ======================
         Fonts
      ====================== */

      fontFamily: {

        ui: [
          "Inter",
          "Noto Sans SC",
          "system-ui",
          "sans-serif"
        ],

        display: [
          "Cinzel",
          "serif"
        ]
      },

      /* ======================
         Border Radius
      ====================== */

      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px"
      },

      /* ======================
         Shadow System
      ====================== */

      boxShadow: {

        card:
          "0 4px 20px rgba(0,0,0,0.4)",

        modal:
          "0 20px 40px rgba(0,0,0,0.6)",

        glow:
          "0 0 10px rgba(200,40,40,0.6)"
      },

      /* ======================
         Spacing System
      ====================== */

      spacing: {

        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem"
      },

      /* ======================
         Animation
      ====================== */

      keyframes: {

        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },

        slideUp: {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          }
        },

        glow: {
          "0%,100%": {
            boxShadow: "0 0 0px rgba(200,40,40,0)"
          },
          "50%": {
            boxShadow: "0 0 12px rgba(200,40,40,0.7)"
          }
        }

      },

      animation: {

        fadeIn: "fadeIn 0.2s ease-in-out",
        slideUp: "slideUp 0.2s ease-out",
        glow: "glow 2s infinite"
      }

    }
    
  },
  plugins: [],
}
