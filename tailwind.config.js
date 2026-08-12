/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6', // Bright modern blue
          600: '#2563eb', 
          700: '#1d4ed8',
          800: '#1e40af', // Deep elegant blue
          900: '#1e3a8a', 
        },
        success: '#10b981', 
        warning: '#f59e0b', 
        danger: '#ef4444', 
        dark: {
          bg: '#0f172a', 
          surface: '#1e293b',
          border: '#334155',
          text: '#f8fafc'
        },
        light: {
          bg: '#fafafa', // Slightly off-white for better contrast with white cards
          surface: '#ffffff',
          border: '#f1f5f9',
          text: '#0f172a'
        }
      },
      fontSize: {
        'base': '1.125rem', // 18px
        'lg': '1.25rem', // 20px
        'xl': '1.5rem', // 24px
        '2xl': '1.875rem', // 30px
        '3xl': '2.25rem', // 36px
        '4xl': '3rem', // 48px
        '5xl': '4rem', // 64px
      },
      boxShadow: {
        'premium-soft': '0 20px 40px -15px rgba(0,0,0,0.05)',
        'premium-hover': '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
        'premium-dark': '0 20px 40px -15px rgba(0,0,0,0.4)',
        'btn-shadow': '0 8px 20px -6px rgba(59, 130, 246, 0.4)',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
