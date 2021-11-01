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
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        'md': '28rem',
        'registration-with-recaptcha': '29.5rem', // google is special
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
      },
      outline: {
        'actual-none': 'none'
      },
      fontSize: {
        'document': '11pt',
        '2xs': '0.625rem'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(closest-side at 50% 50%, var(--tw-gradient-stops))'
      }
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
      backgroundColor: ['active', 'checked'],
      borderColor: ['checked'],
      display: ['dark'],
      padding: ['dark'],
      borderRadius: ['dark']
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
