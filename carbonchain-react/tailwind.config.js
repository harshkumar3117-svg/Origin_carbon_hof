/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'cc-bg': '#0a0f1e',
        'cc-card': '#111827',
        'cc-card2': '#1a2235',
        'cc-border': '#1f2d45',
        'cc-border2': '#263650',
        'cc-green': '#22c55e',
        'cc-emerald': '#10b981',
        'cc-teal': '#14b8a6',
        'cc-blue': '#3b82f6',
        'cc-indigo': '#6366f1',
        'cc-purple': '#a855f7',
        'cc-orange': '#f97316',
        'cc-yellow': '#eab308',
        'cc-red': '#ef4444',
        'cc-pink': '#ec4899',
        'cc-text': '#e2e8f0',
        'cc-muted': '#64748b',
        'cc-muted2': '#94a3b8',
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        modalIn: {
          from: { transform: 'scale(.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        chatIn: {
          from: { transform: 'scale(.85)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        tdot: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'spin-fast': 'spin 1s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'modalIn': 'modalIn .3s ease',
        'slideIn': 'slideIn .3s ease',
        'chatIn': 'chatIn .3s ease',
        'tdot': 'tdot 1.2s infinite',
        'fadeIn': 'fadeIn .2s ease',
        'slideUp': 'slideUp .4s ease',
      }
    },
  },
  plugins: [],
}
