export const setBackgroundColor = (color = "white") => {
  document.documentElement.style.setProperty("--background-color", color);
};
