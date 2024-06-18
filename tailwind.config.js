/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#121212',
        grayText: '#b3b3b3',
        grayBox: '#2F2E2E',
        dark: '#121212',
        filterButton: '#212121',
        hoverGray: '#292828',
        spotifyGreen: '#1db954',
        blackTint: 'rgba(0, 0, 0, 0.5)',
        miniHover: '#535353',
        red: 'linear-gradient(to right, #ED213A, #93291E)',
        blue: 'linear-gradient(to right, #373B44, #4286f4)',
        green: 'linear-gradient(to right, #000000, #0f9b0f)',
        teal: 'linear-gradient(to right, #1D976C, #93F9B9)',
        purple: 'linear-gradient(to right, #8E2DE2, #4A00E0)',
        orange: 'linear-gradient(to right, #f12711, #f5af19)',
        pink: 'linear-gradient(to right, #f953c6, #b91d73)',
      }
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
}

