/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['"DM Sans"', 'system-ui', 'sans-serif'],
        'mono': ['"DM Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f3d0fe',
          300: '#e8a5fc',
          400: '#d86ef9',
          500: '#c44df0',
          600: '#a530d4',
          700: '#8824ad',
          800: '#71208e',
          900: '#5e1e75',
          950: '#3f0752',
        },
        ink: {
          900: '#0a0a0f',
          800: '#13131e',
          700: '#1e1e2e',
          600: '#2d2d42',
        },
        surface: {
          100: '#f9f7fe',
          200: '#f0ecfa',
          300: '#e2d9f3',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        }
      }
    },
  },
  plugins: [],
}
