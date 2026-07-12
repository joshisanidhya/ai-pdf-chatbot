/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // SAGE brand palette (Unizenlabs orange-red)
        brand: {
          50: '#fff5f0',
          100: '#ffe5d6',
          200: '#ffcdb3',
          300: '#ffa780',
          400: '#ff7942',
          500: '#ff6b2c',
          600: '#e64a13',
          700: '#c4360b',
          800: '#a12c0b',
          900: '#82260d',
          950: '#471003',
        },
        // Dark theme surfaces (Unizenlabs near-black)
        surface: {
          50: '#f9f9fb',
          100: '#f3f3f5',
          800: '#141416',
          850: '#0f0f11',
          900: '#0b0b0d',
          950: '#050506',
        },
        // Accent colors
        accent: {
          purple: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          green: '#10b981',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 1.5s steps(3) infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 107, 44, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 107, 44, 0.6), 0 0 40px rgba(255, 107, 44, 0.2)' },
        },
        typing: {
          '0%': { content: '"."' },
          '33%': { content: '".."' },
          '66%': { content: '"..."' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #ff6b2c 0%, #e63946 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0b0b0d 0%, #141416 50%, #0b0b0d 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
        'brand': '0 4px 24px rgba(255, 107, 44, 0.2)',
        'brand-lg': '0 8px 48px rgba(255, 107, 44, 0.35)',
        'dark-lg': '0 20px 60px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
};
