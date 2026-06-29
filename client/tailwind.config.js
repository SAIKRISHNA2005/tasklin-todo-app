/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        border: "var(--border)",

        "status-done": "var(--status-done)",
        "status-overdue": "var(--status-overdue)",
        "status-due-soon": "var(--status-due-soon)",
      },
      fontFamily: {
        heading: ['"Lora"', '"Fraunces"', 'serif'],
        body: ['"Inter"', '"IBM Plex Sans"', 'sans-serif'],
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.375rem",
        md: "0.5rem",
        lg: "0.5rem",
        full: "9999px",
      },
      boxShadow: {
        none: "none",
        sm: "none",
        DEFAULT: "none",
      },
      spacing: {
        gutter: "1.5rem",
      },
    },
  },
  plugins: [],
};
