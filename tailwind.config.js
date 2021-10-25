module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height'
      },
      gridTemplateColumns: {
        'auto-xs': 'repeat(auto-fill, minmax(12rem, 1fr))',
        'auto-sm': 'repeat(auto-fill, minmax(16rem, 1fr))',
        'auto-md': 'repeat(auto-fill, minmax(20rem, 1fr))',
        'auto-lg': 'repeat(auto-fill, minmax(24rem, 1fr))',
        'auto-xl': 'repeat(auto-fill, minmax(28rem, 1fr))',
        'auto-2xl': 'repeat(auto-fill, minmax(32rem, 1fr))'
      },
      spacing: {
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem'
      },
      outline: {
        'actual-none': 'none'
      }
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
      backgroundColor: ['active', 'checked'],
      borderColor: ['checked'],
      display: ['dark']
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
