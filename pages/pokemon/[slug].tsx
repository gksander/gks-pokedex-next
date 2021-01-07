import * as React from "react";
import {
  getAllPokemonSlugs,
  getPokemonDetails,
} from "../../utils/data-wranglers";
import { GetStaticPaths, GetStaticProps } from "next";

type PokemonDetailsProps = {
  pokemon: ReturnType<typeof getPokemonDetails>;
};

const PokemonDetails: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  return (
    <div>
      <div>{pokemon.slug}</div>
      {pokemon.types.map((type) => (
        <div key={type}>{type}</div>
      ))}
    </div>
  );
};

export default PokemonDetails;

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const slugs = getAllPokemonSlugs();

  return {
    paths: slugs.map((slug) => `/pokemon/${slug}`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  PokemonDetailsProps,
  { slug: string }
> = async ({ params }) => {
  const slug = params?.slug || "";

  const pokemon = getPokemonDetails({ key: "slug", id: slug });
  return {
    props: {
      pokemon,
    },
  };
};
