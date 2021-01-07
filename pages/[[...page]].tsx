import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { PokeListPaginationInfo } from "../types";
import { getSlimPokemonData } from "../utils/data-wranglers";
import { NUM_POKEMON, POKE_LIST_PAGE_SIZE } from "../config";

type PokeListProps = {
  pageInfo: PokeListPaginationInfo;
  pokemon: ReturnType<typeof getSlimPokemonData>[];
};

const PokeList: React.FC<PokeListProps> = ({ pageInfo, pokemon }) => {
  console.log(pokemon);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/types/list">Types list</Link>
        <Link href="/search">Search</Link>
        <h1>Pokemon list</h1>
        {pokemon.map((p) => (
          <div key={p.slug}>
            <Link href={`/pokemon/${p.slug}`}>{p.slug}</Link>
          </div>
        ))}
      </main>
    </div>
  );
};

/**
 * Paths to generate
 */
export const getStaticPaths: GetStaticPaths<{ page: string }> = async (
  context,
) => {
  const NUM_PAGES = Math.ceil(NUM_POKEMON / POKE_LIST_PAGE_SIZE);
  return {
    paths: ["/"].concat(
      Array.from({ length: NUM_PAGES - 1 }).map((_, i) => `/${i + 2}`),
    ),
    fallback: false,
  };
};

/**
 * Props to load in.
 */

export const getStaticProps: GetStaticProps<
  PokeListProps,
  { page: [string] }
> = async ({ params }) => {
  const page = Number(params?.page?.[0] || "1");
  const pageFirstId = (page - 1) * POKE_LIST_PAGE_SIZE + 1;

  const pokemon = Array.from({ length: POKE_LIST_PAGE_SIZE })
    .map((_, i) => pageFirstId + i)
    .map((id) => getSlimPokemonData({ id: String(id) }));

  // console.log("page:", page);
  return {
    props: {
      pageInfo: {
        page,
        totalNumPages: Math.ceil(NUM_POKEMON / POKE_LIST_PAGE_SIZE),
        pageSize: POKE_LIST_PAGE_SIZE,
        totalNumPokemon: NUM_POKEMON,
      },
      pokemon,
    },
  };
};

export default PokeList;
