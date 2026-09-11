/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Primary: Vibrant Aerospace Royal Blue (Replaces neon cyan with authoritative, crisp blue)
        cyan: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        // Secondary: Vibrant Earth Vegetation & Radar Emerald (Crisp remote-sensing green)
        teal: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Brand: Vibrant Cobalt
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        // Premium Space-Tech Design System Tokens
        space: {
          bg: '#071426',
          secondary: '#0B1930',
          surface: '#101F38',
          'surface-hover': '#152A48',
          card: '#101F38',
          'card-hover': '#152A48',
          primary: '#5B8CFF',
          accent: '#7C6CFF',
          purple: '#7C6CFF',
          cyan: '#22D3EE',
          text: '#F5F7FF',
          muted: '#A8B6CF',
          subtle: '#71819B',
          border: '#263B5C',
          active: '#2DD4BF',
          warning: '#F5B942',
        },
        sat: {
          bg: '#071426',
          secondary: '#0B1930',
          card: '#101F38',
          cardHover: '#152A48',
          blue: '#5B8CFF',
          purple: '#7C6CFF',
          cyan: '#22D3EE',
          text: '#F5F7FF',
          secondaryText: '#A8B6CF',
          muted: '#71819B',
          border: '#263B5C',
          active: '#2DD4BF',
          warning: '#F5B942',
        }
      }
    },
  },
  plugins: [],
}
