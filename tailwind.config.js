const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
      },
    },
    container: {
      center: true,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
  purge: ["./pages/**/*.tsx", "./pages/**/*.js", "./components/**/*.tsx"],
};
