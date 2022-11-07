const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height'
      },
      gridTemplateColumns: {
        'auto-2xs': 'repeat(auto-fill, minmax(12rem, 1fr))',
        'auto-xs': 'repeat(auto-fill, minmax(14rem, 1fr))',
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
      },
      fontFamily: {
       // sans: ['Cantarell var', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar')
  ]
}
