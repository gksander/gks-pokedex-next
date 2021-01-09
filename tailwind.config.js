const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        amber: colors.amber,
        fuschia: colors.fuchsia,
        lightBlue: colors.lightBlue,
        lime: colors.lime,
        blueGray: colors.blueGray,
        pink: colors.pink,
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
  darkMode: "class",
};
