/**
 * Typed imports
 */
import { NUM_POKEMON } from "../config";

const pokemonData: {
  id: string;
  identifier: string;
  species_id: string;
  height: string;
  weight: string;
  base_experience: string;
  order: string;
  is_default: string;
}[] = require("../data/json/pokemon.json");
const speciesData: {
  id: string;
  identifier: string;
  generation_id: string;
  evolves_from_species_id: string;
  evolution_chain_id: string;
  color_id: string;
  shape_id: string;
  habitat_id: string;
  gender_rate: string;
  capture_rate: string;
  base_happiness: string;
  is_baby: string;
  hatch_counter: string;
  has_gender_differences: string;
  growth_rate_id: string;
  forms_switchable: string;
  order: string;
  conquest_order: string;
}[] = require("../data/json/pokemon_species.json");
const pokemonTypesData: {
  pokemon_id: string;
  type_id: string;
  slot: string;
}[] = require("../data/json/pokemon_types.json");
const typesData: {
  id: string;
  identifier: string;
  generation_id: string;
  damage_class_id: string;
}[] = require("../data/json/types.json");
const pokemonStatsData: {
  pokemon_id: string;
  stat_id: string;
  base_stat: string;
  effort: string;
}[] = require("../data/json/pokemon_stats.json");
const statsData: {
  id: string;
  damage_class_id: string;
  identifier: string;
  is_battle_only: string;
  game_index: string;
}[] = require("../data/json/stats.json");
const speciesFlavorData: {
  species_id: string;
  version_id: string;
  language_id: string;
  flavor_text: string;
}[] = require("../data/json/pokemon_species_flavor_text.json");
const damageFactorData: {
  damage_type_id: string;
  target_type_id: string;
  damage_factor: string;
}[] = require("../data/json/type_efficacy.json");
type Color = { rgb: number[]; population: number };
const pokemonColorPalettes: {
  Vibrant: Color;
  DarkVibrant: Color;
  LightVibrant: Color;
  Muted: Color;
  DarkMuted: Color;
  LightMuted: Color;
}[] = require("../data/pokemon-colors.json");
import { capitalize } from "lodash";

export const getAllPokemonSlugs = () =>
  pokemonData
    .filter((p) => Number(p.id) < NUM_POKEMON)
    .map((p) => p.identifier);

export const getPokemonDetails = ({
  key = "id",
  id = "",
}: {
  key?: "id" | "slug";
  id: string;
}) => {
  const pokemon = pokemonData.find(
    (p) => String(p[key === "id" ? "id" : "identifier"]) === id,
  );

  const flavorText = (
    speciesFlavorData.find(
      (rec) => String(rec.species_id) === String(pokemon.id),
    )?.flavor_text || "No description."
  ).replace(/[\n\r\f]/g, " ");
  const colorPalette = pokemonColorPalettes[pokemon.id];
  const types = pokemonTypesData
    .filter((typeAssoc) => String(typeAssoc.pokemon_id) === String(pokemon.id))
    .map((typeAssoc) =>
      typesData.find((type) => String(type.id) === String(typeAssoc.type_id)),
    )
    .map((type) => type.identifier);
  const typeIds = pokemonTypesData
    .filter((typeAssoc) => String(typeAssoc.pokemon_id) === String(pokemon.id))
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

    const firstSpecies = speciesInChain.find((s) => !s.evolves_from_species_id);
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

  return {
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
      : {},
    nextPokemon: nextPokemon
      ? {
          id: nextPokemon.id,
          slug: nextPokemon.identifier,
        }
      : {},
    flavorText,
    colorPalette: trimColorPalette({ colorPalette }),
    weaknesses,
    evolutionChain,
  };
};

const trimColorPalette = ({
  colorPalette,
}: {
  colorPalette: typeof pokemonColorPalettes[0];
}) => {
  return Object.entries(colorPalette || {}).reduce((acc, [key, value]) => {
    acc[key] = value?.rgb?.length ? value?.rgb : "";
    return acc;
  }, {} as { [K in keyof typeof pokemonColorPalettes[0]]: number[] | "" });
};

export const getSlimPokemonData = ({
  key = "id",
  id = "",
}: {
  key?: "id" | "slug";
  id: string;
}) => {
  const { id: pid, slug, flavorText, types, colorPalette } = getPokemonDetails({
    key,
    id,
  });
  return { id: pid, slug, flavorText, types, colorPalette };
};

export const getAllTypes = () =>
  typesData.map((type) => ({
    id: type.id,
    slug: type.identifier,
  }));

export const getTypeBySlug = ({ slug = "" }) => {
  const type = typesData.find((t) => t.identifier === slug);

  return {
    slug: type.identifier,
    pokemon: pokemonTypesData
      .filter((assoc) => assoc.type_id === type.id)
      .map((assoc) => assoc.pokemon_id)
      .filter((id) => Number(id) <= NUM_POKEMON)
      .map((id) => getSlimPokemonData({ id })),
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
};

export const getSearchList = () =>
  pokemonData
    .filter((p) => Number(p.id) < NUM_POKEMON)
    .map((p) => ({
      id: p.id,
      slug: p.identifier,
    }));
