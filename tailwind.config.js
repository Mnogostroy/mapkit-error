// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{scss,html,vue,ts,tsx,js,json}'],
  darkMode: ['class', '.ns-dark'],
  theme: {},
  corePlugins: {
    container: false,
    preflight: false,
  },
  plugins: [
    /* plugin adds the ios: and android: variants */
    plugin(function ({ addVariant }) {
      addVariant('android', '.ns-android &')
      addVariant('ios', '.ns-ios &')
      addVariant('dark', '.ns-dark &')
      addVariant('light', '.ns-light &')
    }),
  ],
}
