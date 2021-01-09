import * as React from "react";
import Link from "next/link";
import { Pokeball } from "./Pokeball";
import { PokeTypeChip } from "./PokeTypeChip";
import { motion } from "framer-motion";
import { getPokemonDetails, getSlimPokemonData } from "../utils/data-wranglers";
import { PokeImg } from "./PokeImg";
import { usePrefersDarkMode } from "./PrefersDarkModeContainer";

type PokeListCardProps = {
  pokemon?:
    | ReturnType<typeof getSlimPokemonData>
    | ReturnType<typeof getPokemonDetails>;
};

export const PokeListCard = React.forwardRef<HTMLDivElement, PokeListCardProps>(
  ({ pokemon }, ref) => {
    const prefersDark = usePrefersDarkMode();

    const pokeballColor = React.useMemo(() => {
      const rgb = prefersDark
        ? pokemon?.colorPalette?.DarkMuted || pokemon?.colorPalette?.DarkVibrant
        : pokemon?.colorPalette?.LightMuted ||
          pokemon?.colorPalette?.LightVibrant;

      return rgb
        ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`
        : prefersDark
        ? `rgba(200, 200, 200, 0.5)`
        : `rgba(0, 0, 0, 0.5)`;
    }, [pokemon, prefersDark]);

    return (
      <motion.div
        className="grid sm:grid-cols-4 gap-6 card transition-all duration-300"
        ref={ref}
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <div className="sm:col-span-1 flex justify-center">
          <div className="w-56 sm:w-full">
            <div className="relative aspect-h-1 aspect-w-1">
              <motion.div className="absolute inset-0">
                <div className="p-2">
                  <motion.div
                    variants={{
                      rest: {
                        scale: 1,
                        rotate: 0,
                        color: prefersDark
                          ? "rgba(50, 50, 50, 0.8)"
                          : "rgba(200, 200, 200, 0.8)",
                      },
                      hover: {
                        scale: 1.2,
                        rotate: 180,
                        color: pokeballColor,
                      },
                    }}
                    key={prefersDark ? "dark" : "light"}
                  >
                    <Pokeball />
                  </motion.div>
                </div>
                <Link href={`/pokemon/${pokemon?.slug}`} passHref>
                  <a className="absolute inset-0">
                    <PokeImg id={pokemon.id} slug={pokemon.slug} />
                  </a>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="sm:col-span-3 sm:pt-3">
          <div className="flex justify-between items-baseline">
            <Link href={`/pokemon/${pokemon?.slug}`} passHref>
              <a className="capitalize font-bold text-2xl text-gray-800 dark:text-gray-100 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-150">
                {pokemon?.slug}
              </a>
            </Link>
            {pokemon?.id && (
              <span className="text-gray-600 dark:text-gray-300 text-xl font-bold">
                #{pokemon?.id}
              </span>
            )}
          </div>
          <div className="text-gray-700 dark:text-gray-400 mb-2">
            {pokemon?.flavorText}
          </div>
          <div className="-mx-1">
            {(pokemon?.types || []).map((slug) => (
              <span key={slug} className="mx-1">
                <PokeTypeChip slug={slug} />
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  },
);
