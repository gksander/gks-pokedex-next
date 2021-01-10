const path = require("path");
const klaw = require("klaw");
const fse = require("fs-extra");

const TCG_DIR = path.resolve(__dirname, "../data/tcg");

/**
 * Main function
 */
module.exports = async () => {
  try {
    await generateCardData();

    console.log("all done");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Generate card data
 */
const generateCardData = async () => {
  const paths = [];
  await new Promise((resolve, reject) => {
    klaw(path.join(TCG_DIR, "cards"))
      .on("data", async (item) => {
        if (!/\.json$/i.test(item.path)) return;
        paths.push(item.path);
      })
      .on("end", resolve);
  });

  const cards = [];
  const proms = paths.map(async (thePath) => {
    const data = (await fse.readJson(thePath))
      .filter((item) => item.supertype === "Pokémon")
      .map(({ name, imageUrl, imageUrlHiRes, setCode }) => ({
        name,
        imageUrl,
        imageUrlHiRes,
        setCode,
      }));
    cards.push(...data);
  });

  await Promise.all(proms);

  await fse.writeJson(path.join(TCG_DIR, "slim_cards.json"), cards);
};

module.exports();
