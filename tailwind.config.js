/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Helvetica Neue'", 'sans-serif'],
      },
      colors: {
        app: {
          bg: '#080808',
          surface: '#1C1C1E',
          'text-primary': '#FFFFFF',
          'text-secondary': 'rgba(255,255,255,0.28)',
          'text-muted': 'rgba(255,255,255,0.22)',
          divider: 'rgba(255,255,255,0.05)',
        },
      },
      letterSpacing: {
        wordmark: '5px',
        badge: '1.2px',
        label: '2px',
      },
    },
  },
  plugins: [],
}
