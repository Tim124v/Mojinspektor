/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC143C',
        'primary-dark': '#B01030',
        success: '#3B6D11',
        'success-light': '#EAF3DE',
        error: '#A32D2D',
        'error-light': '#FCEBEB',
        card: '#F9F9F9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '430px',
      }
    },
  },
  plugins: [],
}
