/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "radius-to-square": {
          "0%": { borderRadius: "9999px" }, // equivalente a rounded-full
          "100%": { borderRadius: "0.5rem" }, // equivalente a rounded-lg
        },
        "radius-to-round": {
          "0%": { borderRadius: "0.5rem" }, // rounded-lg
          "100%": { borderRadius: "9999px" }, // rounded-full
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
        },

        "open-navigation": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },

        "notification-enter": {
          "0%": {
            transform: "translateX(100%) scale(0.95)",
            opacity: "0",
          },
          "60%": {
            transform: "translateX(-10%) scale(1.02)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translateX(0) scale(1)",
            opacity: "1",
          },
        },
        "notification-exit": {
          "0%": {
            transform: "translateX(0) scale(1)",
            opacity: "1",
          },
          "40%": {
            transform: "translateX(-10%) scale(1.02)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translateX(100%) scale(0.95)",
            opacity: "0",
          },
        },
      },

      animation: {
        "radius-to-square": "radius-to-square 200ms ease-in-out forwards",
        "radius-to-round": "radius-to-round  200ms ease-in-out forwards",
        "open-navigation": "open-navigation 0.4s ease forwards",
        "fade-in": "fade-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "fade-out": "fade-out 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "notification-enter":
          "notification-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "notification-exit":
          "notification-exit 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
