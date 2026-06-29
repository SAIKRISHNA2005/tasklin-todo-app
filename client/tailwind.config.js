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
        "surface-raised": "var(--surface-raised)",
        "surface-alt": "var(--surface-alt)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-faint": "var(--text-faint)",
        accent: "var(--accent)",
        "accent-warm": "var(--accent-warm)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        ring: "var(--ring)",
        "status-done": "var(--status-done)",
        "status-overdue": "var(--status-overdue)",
        "status-due-soon": "var(--status-due-soon)",
      },
      fontFamily: {
        heading: ["ui-sans-serif", "system-ui", "sans-serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        card: "var(--shadow-card)",
      },
      spacing: {
        gutter: "1.5rem",
      },
    },
  },
  plugins: [],
};

