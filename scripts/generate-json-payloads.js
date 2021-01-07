const { capitalize } = require("lodash");
const path = require("path");
const fse = require("fs-extra");
const csv = require("csvtojson");
const pokemonColorPalettes = require("../data/pokemon-colors");

// Config
const NUM_POKEMON =
  {
    one: 1,
    starters: 9,
    gen1: 151,
    gen2: 251,
    gen3: 384,
    gen4: 491,
    gen5: 649,
  }["gen5"] || 9;
const DATA_DIR = path.join(__dirname, "data/csv");
const OUTPUT_DIR = path.join(__dirname, "../public/data");

module.exports = async () => {
  try {
    /**
     * Load in data first
     */
    // Types
    const typesData = await csv().fromFile(path.join(DATA_DIR, "types.csv"));
    // Damage factors (how strong types are against each other)
    const damageFactorData = (
      await csv().fromFile(path.join(DATA_DIR, "type_efficacy.csv"))
    ).map((item) => ({
      id: `${item.damage_type_id}.${item.target_type_id}`,
      ...item,
    }));
    // Pokemon species
    const speciesData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_species.csv"))
    ).filter((dat) => parseInt(dat.id) <= NUM_POKEMON);
    // Species "Flavor" info, to get description
    const speciesFlavorData = (
      await csv().fromFile(
        path.join(DATA_DIR, "pokemon_species_flavor_text.csv"),
      )
    ).filter((dat) => parseInt(dat.species_id) <= NUM_POKEMON);
    // Pokemon themselves
    const pokemonData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon.csv"))
    ).filter((dat) => parseInt(dat.id) <= NUM_POKEMON);
    // Pivot table for pokemon and types
    const pokemonTypesData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_types.csv"))
    ).filter((dat) => parseInt(dat.pokemon_id) <= NUM_POKEMON);
    // Stat information
    const statsData = await csv().fromFile(path.join(DATA_DIR, "stats.csv"));
    // Pivot table for pokemon and stats
    const pokemonStatsData = (
      await csv().fromFile(path.join(DATA_DIR, "pokemon_stats.csv"))
    ).filter((dat) => parseInt(dat.pokemon_id) <= NUM_POKEMON);

    const slimPokemonDataHash = {};
    for (let id = 1; id <= pokemonData.length; id++) {
      const pokemon = pokemonData.find((p) => String(p.id) === String(id));
      const flavorText = (
        speciesFlavorData.find((rec) => String(rec.species_id) === String(id))
          ?.flavor_text || "No description."
      ).replace(/[\n\r\f]/g, " ");
      const colorPalette = pokemonColorPalettes[id];
      const types = pokemonTypesData
        .filter((typeAssoc) => String(typeAssoc.pokemon_id) === String(id))
        .map((typeAssoc) =>
          typesData.find(
            (type) => String(type.id) === String(typeAssoc.type_id),
          ),
        )
        .map((type) => type.identifier);

      slimPokemonDataHash[id] = {
        id: pokemon.id,
        name: capitalize(pokemon.identifier),
        slug: pokemon.identifier,
        flavorText,
        colorPalette: trimColorPalette({ colorPalette }),
        types,
      };
    }

    // Pokemon
    await generatePaginatedPokemonList({ slimPokemonDataHash });
    await generateIndividualPokemonPayloads({
      pokemonData,
      pokemonTypesData,
      speciesData,
      typesData,
      speciesFlavorData,
      statsData,
      pokemonStatsData,
      damageFactorData,
    });
    // Search
    await generateSearchList({ pokemonData });
    // Types
    await generateTypesList({ typesData });
    await generateIndividualTypePayloads({
      typesData,
      pokemonTypesData,
      damageFactorData,
      slimPokemonDataHash,
    });
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

/**
 * Generate "all types" list
 */
const generateTypesList = async ({ typesData }) => {
  const payload = typesData.map((type) => ({
    id: type.id,
    slug: type.identifier,
  }));

  await fse.ensureDir(path.join(OUTPUT_DIR, "types"));
  await fse.writeJson(path.join(OUTPUT_DIR, "types/index.json"), payload);
};

const generateIndividualTypePayloads = async ({
  typesData,
  pokemonTypesData,
  damageFactorData,
  slimPokemonDataHash,
}) => {
  await fse.ensureDir(path.join(OUTPUT_DIR, "types"));

  const promises = typesData.map((type) => {
    return new Promise(async (resolve) => {
      try {
        const payload = {
          slug: type.identifier,
          pokemon: pokemonTypesData
            .filter((assoc) => assoc.type_id === type.id)
            .map((assoc) => assoc.pokemon_id)
            .map((id) => slimPokemonDataHash[id]),
          efficacyTo: damageFactorData
            .filter((assoc) => String(assoc.damage_type_id) === String(type.id))
            .map((assoc) => ({
              type: typesData.find(
                (t) => String(t.id) === String(assoc.target_type_id),
              )?.identifier,
              factor: Number(assoc.damage_factor),
            })),
          efficacyFrom: damageFactorData
            .filter((assoc) => String(assoc.target_type_id) === String(type.id))
            .map((assoc) => ({
              type: typesData.find(
                (t) => String(t.id) === String(assoc.damage_type_id),
              )?.identifier,
              factor: Number(assoc.damage_factor),
            })),
        };

        await fse.writeJson(
          path.join(OUTPUT_DIR, "types", `${type.identifier}.json`),
          payload,
        );
      } finally {
        resolve();
      }
    });
  });

  await Promise.all(promises);
};

/**
 * Generating search list
 */
const generateSearchList = async ({ pokemonData }) => {
  const payload = pokemonData.map((pokemon) => ({
    id: pokemon.id,
    slug: pokemon.identifier,
  }));

  await fse.ensureDir(path.join(OUTPUT_DIR, "search"));
  await fse.writeJson(path.join(OUTPUT_DIR, "search/index.json"), payload);
};

/**
 * Generating pokemon list
 */
const PAGE_SIZE = 50;
const generatePaginatedPokemonList = async ({ slimPokemonDataHash }) => {
  await fse.ensureDir(path.join(OUTPUT_DIR, "pokemon/list"));
  await fse.emptyDir(path.join(OUTPUT_DIR, "pokemon/list"));
  const NUM_POKEMON = Object.keys(slimPokemonDataHash).length;

  const totalNumPages = Math.ceil(NUM_POKEMON / PAGE_SIZE);
  for (let page = 1; page <= totalNumPages; page++) {
    const pageFirstId = (page - 1) * PAGE_SIZE + 1;
    const pageLastId = Math.min(page * PAGE_SIZE, NUM_POKEMON);
    const payload = {
      pageInfo: {
        page,
        totalNumPages,
        pageSize: PAGE_SIZE,
        totalNumPokemon: NUM_POKEMON,
      },
      pokemon: [],
    };

    for (let id = pageFirstId; id <= pageLastId; id++) {
      payload.pokemon.push(slimPokemonDataHash[id]);
    }

    await fse.writeJson(
      path.join(OUTPUT_DIR, "pokemon/list", `${page}.json`),
      payload,
    );
  }
};

const generateIndividualPokemonPayloads = async ({
  pokemonData,
  speciesData,
  pokemonTypesData,
  typesData,
  speciesFlavorData,
  statsData,
  pokemonStatsData,
  damageFactorData,
}) => {
  await fse.ensureDir(path.join(OUTPUT_DIR, "pokemon/details"));
  await fse.emptyDir(path.join(OUTPUT_DIR, "pokemon/details"));

  const promises = pokemonData.map((pokemon) => {
    return new Promise(async (resolve) => {
      try {
        const flavorText = (
          speciesFlavorData.find(
            (rec) => String(rec.species_id) === String(pokemon.id),
          )?.flavor_text || "No description."
        ).replace(/[\n\r\f]/g, " ");
        const colorPalette = pokemonColorPalettes[pokemon.id];
        const types = pokemonTypesData
          .filter(
            (typeAssoc) => String(typeAssoc.pokemon_id) === String(pokemon.id),
          )
          .map((typeAssoc) =>
            typesData.find(
              (type) => String(type.id) === String(typeAssoc.type_id),
            ),
          )
          .map((type) => type.identifier);
        const typeIds = pokemonTypesData
          .filter(
            (typeAssoc) => String(typeAssoc.pokemon_id) === String(pokemon.id),
          )
          .map((typeAssoc) => typeAssoc.type_id);

        const stats = pokemonStatsData
          .filter((stat) => String(stat.pokemon_id) === String(pokemon.id))
          .map((stat) => {
            const statDetail = statsData.find(
              (dat) => String(dat.id) === String(stat.stat_id),
            );

            return {
              base: stat.base_stat,
              name: statDetail.identifier
                .split("-")
                .map(capitalize)
                .join(" ")
                .replace(/^hp$/i, "HP")
                .replace(/special/i, "Sp."),
            };
          });
        const previousPokemon = pokemonData.find(
          (p) => Number(p.id) === Number(pokemon.id) - 1,
        );
        const nextPokemon = pokemonData.find(
          (p) => Number(p.id) === Number(pokemon.id) + 1,
        );

        const weaknesses = (() => {
          const weaknesses = [];

          for (let type of typesData) {
            const aggFactor = damageFactorData
              .filter(
                (assoc) =>
                  String(assoc.damage_type_id) === String(type.id) &&
                  typeIds.includes(assoc.target_type_id),
              )
              .map((assoc) => Number(assoc.damage_factor) / 100)
              .reduce((acc, x) => acc * x, 1);

            if (aggFactor > 1) {
              weaknesses.push({ slug: type.identifier, factor: aggFactor });
            }
          }

          return weaknesses;
        })();

        const evolutionChain = (() => {
          const getSlimDetails = (species) => ({
            id: species.id,
            slug: species.identifier,
          });
          const species = speciesData.find(
            (s) => String(s.id) === String(pokemon.id),
          );
          const evChainId = species.evolution_chain_id;

          const speciesInChain = speciesData.filter(
            (s) => String(s.evolution_chain_id) === evChainId,
          );

          const firstSpecies = speciesInChain.find(
            (s) => !s.evolves_from_species_id,
          );
          if (!firstSpecies) return [];

          const buckets = [[getSlimDetails(firstSpecies)]];

          let areDone = false;
          while (!areDone) {
            const lastBucket = buckets[buckets.length - 1];
            const lastBucketIds = lastBucket.map((dat) => dat.id);

            const newBucket = speciesInChain
              .filter((s) => lastBucketIds.includes(s.evolves_from_species_id))
              .map(getSlimDetails);

            if (!newBucket.length) {
              areDone = true;
            } else {
              buckets.push(newBucket);
            }
          }

          return buckets;
        })();

        const payload = {
          id: pokemon.id,
          slug: pokemon.identifier,
          types,
          height: Math.round((parseInt(pokemon.height) / 3.048) * 100) / 100, // Feet
          weight: Math.round((parseInt(pokemon.weight) / 4.536) * 100) / 100, // Lbs
          stats,
          previousPokemon: previousPokemon
            ? {
                id: previousPokemon.id,
                slug: previousPokemon.identifier,
              }
            : undefined,
          nextPokemon: nextPokemon
            ? {
                id: nextPokemon.id,
                slug: nextPokemon.identifier,
              }
            : undefined,
          flavorText,
          colorPalette: trimColorPalette({ colorPalette }),
          weaknesses,
          evolutionChain,
        };

        await fse.writeJson(
          path.join(
            OUTPUT_DIR,
            "pokemon/details",
            `${pokemon.identifier}.json`,
          ),
          payload,
        );
      } finally {
        resolve();
      }
    }).catch(console.log);
  });

  await Promise.all(promises);
};

/**
 * Remove crap we don't need from color palette
 */
const trimColorPalette = ({ colorPalette }) => {
  if (!colorPalette) return {};

  return Object.entries(colorPalette).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value?.rgb || undefined;
    }
    return acc;
  }, {});
};

module.exports();
