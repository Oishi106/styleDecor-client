/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        styleDecorTheme: {
          "primary": "#FF6B6B",      // Vibrant Red
          "primary-focus": "#FF5252",
          "primary-content": "#ffffff",
          
          "secondary": "#4ECDC4",    // Teal/Turquoise
          "secondary-focus": "#3BB3AB",
          "secondary-content": "#ffffff",
          
          "accent": "#FFD93D",       // Golden Yellow
          "accent-focus": "#FFC72C",
          "accent-content": "#000000",
          
          "neutral": "#2C3E50",      // Dark Blue-Gray
          "neutral-focus": "#1A252F",
          "neutral-content": "#ffffff",
          
          "base-100": "#FFFFFF",
          "base-200": "#F8F9FA",
          "base-300": "#E9ECEF",
          "base-content": "#1a202c",
          
          "info": "#0EA5E9",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
    ],
    styled: true,
    base: true,
    utils: true,
    logs: true,
  },
}
