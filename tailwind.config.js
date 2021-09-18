module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',

        'max-height': 'max-height'
      }
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
      backgroundColor: ['active', 'checked'],
      borderColor: ['checked'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
