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
        dark: {
          950: '#040711',
          900: '#0A0F1D',
          850: '#0E1626',
          800: '#131C31',
          750: '#19243C',
          700: '#202D49',
          600: '#334155',
        },
        brand: {
          cyan: '#00F5D4',
          neon: '#00F0FF',
          blue: '#3B82F6',
          indigo: '#6366F1',
          purple: '#8B5CF6',
        },
        bull: {
          DEFAULT: '#10B981',
          light: '#34D399',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        bear: {
          DEFAULT: '#F43F5E',
          light: '#FB7185',
          glow: 'rgba(244, 63, 94, 0.25)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.3))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.8))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
