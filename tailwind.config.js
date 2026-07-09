/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern Corporate-Athletic Theme
        'midnight': '#0f172a',
        'surface': '#1e293b',
        'surface-2': '#0f1f35',
        'cyan-accent': '#06b6d4',
        'cyan-light': '#67e8f9',
        'cyan-dark': '#0891b2',
        'slate-border': '#475569',
        'slate-muted': '#64748b',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        // Legacy tokens (kept for backward compat)
        'fifa-green': '#00ff87',
        'fifa-purple': '#6300ff',
        'dark-bg': '#0f172a',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)",
        'hero-gradient': "linear-gradient(135deg, #0f172a 0%, #0f1f35 50%, #0f172a 100%)",
        'cyan-gradient': "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        'glow-gradient': "radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(6, 182, 212, 0.3)',
        'cyan-glow-sm': '0 0 10px rgba(6, 182, 212, 0.2)',
        'panel': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(6,182,212,0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6,182,212,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(6,182,212,0.5)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
