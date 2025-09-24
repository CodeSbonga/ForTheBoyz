/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'telkom-blue': '#0057B7',
        'telkom-light-blue': '#0066CC',
        'telkom-dark-blue': '#004499',
        'telkom-white': '#FFFFFF',
        'telkom-gray': '#F5F5F5',
        'telkom-dark-gray': '#333333',
      },
      fontFamily: {
        'telkom': ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}