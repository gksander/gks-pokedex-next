export const titleCase = (str: string) =>
  str
    .split(" ")
    .map((bit) => bit[0].toUpperCase() + bit.slice(1))
    .join(" ");
