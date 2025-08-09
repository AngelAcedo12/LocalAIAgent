/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
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
        "notification-enter":
          "notification-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "notification-exit":
          "notification-exit 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
    },
  },
  plugins: [],
};
