const Datastore = require("nedb");
const path = require("path");
const klaw = require("klaw");
const fse = require("fs-extra");

const TCG_DIR = path.resolve(__dirname, "../data/tcg");

const CARD_DB = new Datastore({
  filename: path.join(TCG_DIR, "cards.db"),
});
const DECKS_DB = new Datastore({
  filename: path.join(TCG_DIR, "decks.db"),
});

const insertRecord = ({ db, record }) =>
  new Promise((resolve, reject) => {
    db.insert(record, (err) => (err ? reject(err) : resolve()));
  });

/**
 * Main function
 */
module.exports = async () => {
  try {
    // await populateCardsData();
    // await populateDecksData();
    await generateCardData();

    console.log("all done");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Populate cards data
 */
const populateCardsData = async () => {
  await fse.remove(path.join(TCG_DIR, "cards.db"));

  // Load card DB
  await new Promise((resolve, reject) =>
    CARD_DB.loadDatabase((err) => {
      if (err) reject(err);
      resolve();
    }),
  );

  await new Promise((resolve, reject) => {
    klaw(path.join(TCG_DIR, "cards"))
      .on("data", async (item) => {
        if (!/\.json$/i.test(item.path)) return;

        try {
          const data = require(item.path);
          await insertRecord({
            db: CARD_DB,
            record: data,
          });
        } catch (err) {
          reject(err);
        }
      })
      .on("end", resolve);
  });
};

/**
 * Populate decks data
 */
const populateDecksData = async () => {
  await fse.remove(path.join(TCG_DIR, "decks.db"));

  // Load card DB
  await new Promise((resolve, reject) =>
    DECKS_DB.loadDatabase((err) => {
      if (err) reject(err);
      resolve();
    }),
  );

  await new Promise((resolve, reject) => {
    klaw(path.join(TCG_DIR, "decks"))
      .on("data", async (item) => {
        if (!/\.json$/i.test(item.path)) return;

        try {
          const data = require(item.path);
          await insertRecord({
            db: DECKS_DB,
            record: data,
          });
        } catch (err) {
          reject(err);
        }
      })
      .on("end", resolve);
  });
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
