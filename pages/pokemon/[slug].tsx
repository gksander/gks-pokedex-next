import * as React from "react";
import {
  getAllPokemonSlugs,
  getPokemonDetails,
} from "../../utils/data-wranglers";
import { GetStaticPaths, GetStaticProps } from "next";
import tinycolor from "tinycolor2";
import Link from "next/link";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaRuler,
  FaTimes,
  FaWeight,
} from "react-icons/fa";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { PokeImg } from "../../components/PokeImg";
import { setBackgroundColor } from "../../utils/setBackgroundColor";
import { ViewWrapper } from "../../components/ViewWrapper";
import { PokeTypeChip } from "../../components/PokeTypeChip";
import { useRouter } from "next/router";
import { useKey } from "react-use";
import { PokeStatChart } from "../../components/PokeStatChart";
import classNames from "classnames";
import Head from "next/head";
import { titleCase } from "../../utils/titleCase";
import { usePrefersDarkMode } from "../../components/PrefersDarkModeContainer";

type PokemonDetailsProps = {
  pokemon: ReturnType<typeof getPokemonDetails>;
};
type Card = PokemonDetailsProps["pokemon"]["cards"][number];

const PokemonDetails: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  // Colors
  const color = useColor({ pokemon });
  const bgColor = useBackgroundColor({ pokemon });
  useSetBackgroundColor(bgColor);
  const { prefersDarkMode } = usePrefersDarkMode();

  return (
    <ViewWrapper>
      <Head>
        <title>{titleCase(pokemon.slug)}</title>
        <meta
          name="description"
          content={`Details for Pokemon ${titleCase(pokemon.slug)}`}
        />
      </Head>
      <div>
        <div className="container max-w-2xl py-6 px-2">
          <div className="grid sm:grid-cols-2 gap-12">
            <div>
              <div className="w-3/4 sm:w-full relative mx-auto aspect-h-1 aspect-w-1">
                <div className="absolute inset-0">
                  <AnimatePresence exitBeforeEnter initial={false}>
                    <motion.div
                      key={pokemon.slug}
                      variants={{
                        in: {
                          opacity: 1,
                          scale: 1,
                          transition: { duration: 0.2 },
                        },
                        out: {
                          opacity: 0,
                          scale: 0.7,
                          transition: { duration: 0.15 },
                        },
                      }}
                      initial="out"
                      animate="in"
                      exit="out"
                    >
                      <PokeImg
                        slug={pokemon.slug || ""}
                        id={pokemon.id || ""}
                        imgClassName="w-full h-full object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="absolute inset-0">
                  <div
                    className="absolute left-0 bottom-0 text-6xl text-gray-700 font-fancy font-thin"
                    style={{
                      color,
                      filter: prefersDarkMode
                        ? `drop-shadow(2px 2px 2px rgba(100, 100, 100, 0.8))`
                        : `drop-shadow(2px 2px 2px rgba(50, 50, 50, 0.8))`,
                    }}
                  >
                    #{pokemon.id}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-6xl leading-snug capitalize overflow-ellipsis truncate">
                {pokemon.slug}
              </div>
              {/* Types */}
              <div className="flex -mx-1 mb-3">
                {(pokemon.types || []).map((slug) => (
                  <div className="mx-1" key={slug}>
                    <PokeTypeChip slug={slug} />
                  </div>
                ))}
              </div>
              {/* Weight/height */}
              <div className="flex mb-2 text-gray-800 dark:text-gray-300">
                <div className="mr-5 flex items-center">
                  <span className="mr-2">
                    <FaRuler />
                  </span>
                  <span className="">{pokemon.height} ft</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">
                    <FaWeight />
                  </span>
                  <span className="">{pokemon.weight} lbs</span>
                </div>
              </div>
              {/*	Description */}
              <div className="text-gray-800 dark:text-gray-400 mb-4">
                {pokemon.flavorText}
              </div>
              <div className="text-xl font-bold">Weaknesses</div>
              <div className="flex flex-wrap">
                {(pokemon.weaknesses || []).map(({ factor, slug }) => (
                  <div className="mr-1 mb-1" key={slug}>
                    <PokeTypeChip slug={slug} isSmall isStarred={factor > 2} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-12" />
          <div className="grid sm:grid-cols-4 gap-12">
            <div>
              <div className="text-xl font-bold mb-4">Stats</div>
              <div className="w-32 mx-auto">
                <div className="w-full relative aspect-w-1 aspect-h-1">
                  <div className="absolute inset-0 text-gray-700 dark:text-gray-300">
                    {pokemon.stats?.length && (
                      <PokeStatChart
                        stats={pokemon.stats}
                        color={color}
                        bgColor={bgColor}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <EvolutionChain pokemon={pokemon} />
          </div>
          <div className="mb-12" />
          <CardsSection pokemon={pokemon} key={pokemon.slug} />
          <div className="mb-12" />
          {/* Links */}
          <BottomLinks pokemon={pokemon} />
        </div>
      </div>
    </ViewWrapper>
  );
};

/**
 * Evolution chain UI
 */
const EV_SIZE = "100px";
const EvolutionChain: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  if ((pokemon.evolutionChain?.length || 0) <= 1) return null;

  const buckets = pokemon.evolutionChain || [];

  return (
    <div className="sm:col-span-3 flex flex-col">
      <div className="text-xl font-bold mb-4">Evolutions</div>
      <div className="flex gap-2 flex-col sm:flex-row items-center flex-grow">
        {buckets.map((bucket, i) => (
          <React.Fragment key={i}>
            <div
              style={{ width: EV_SIZE, height: EV_SIZE }}
              className="overflow-y-auto overflow-x-hidden grid gap-2"
            >
              {bucket.map((item, j) => (
                <Link href={`/pokemon/${item.slug}`} key={j}>
                  <a
                    className="block relative transition-all duration-300 flex flex-col evLink"
                    style={{
                      width: EV_SIZE,
                      height: EV_SIZE,
                    }}
                  >
                    <div className="flex-grow relative">
                      <div className="absolute inset-0 evImg transition-all duration-200">
                        <PokeImg {...item} />
                      </div>
                    </div>
                    <div
                      className={classNames(
                        "text-center text-gray-700 dark:text-gray-300 overflow-hidden whitespace-no-wrap capitalize",
                        item.slug === pokemon.slug && "font-bold text-gray-900",
                      )}
                      style={{
                        maxWidth: EV_SIZE,
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.slug}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            {i < buckets.length - 1 && (
              <div className="flex p-2 items-center">
                <FaChevronRight className="hidden sm:block" />
                <FaChevronDown className="block sm:hidden" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const BottomLinks: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  const prevLink = pokemon?.previousPokemon?.slug
    ? `/pokemon/${pokemon.previousPokemon.slug}`
    : "/";
  const nextLink = pokemon?.nextPokemon?.slug
    ? `/pokemon/${pokemon?.nextPokemon?.slug || ""}`
    : "/";

  const router = useRouter();
  const goNext = React.useCallback(() => router.push(nextLink), [
    router,
    nextLink,
  ]);
  const goPrev = React.useCallback(() => router.push(prevLink), [
    router,
    prevLink,
  ]);
  useKey("ArrowRight", goNext, {}, [goNext]);
  useKey("ArrowLeft", goPrev, {}, [goPrev]);

  return (
    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 sticky bottom-0 py-3 border-t customBgColor">
      <Link href={prevLink}>
        <a className="border-2 w-36 rounded flex justify-center items-center border-gray-700 dark:border-gray-300 hover:font-bold">
          <span className="p-2 pr-0">
            <FaChevronLeft />
          </span>
          <span className="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap capitalize">
            {pokemon?.previousPokemon?.slug || "Pokedex"}
          </span>
          <AnimatePresence exitBeforeEnter>
            {Boolean(pokemon?.previousPokemon?.id) && (
              <motion.span
                className="w-8 h-8 p-2 pl-0"
                key={pokemon?.previousPokemon?.slug || ""}
                variants={{
                  in: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
                  out: {
                    opacity: 0,
                    scale: 0.4,
                    transition: { duration: 0.1 },
                  },
                }}
                initial="out"
                animate="in"
                exit="out"
              >
                <PokeImg
                  slug={pokemon?.previousPokemon?.slug || ""}
                  id={pokemon?.previousPokemon?.id || ""}
                />
              </motion.span>
            )}
          </AnimatePresence>
        </a>
      </Link>
      <Link href={nextLink}>
        <a className="border-2 w-36 rounded flex justify-center items-center border-gray-700 dark:border-gray-300 hover:font-bold">
          <AnimatePresence exitBeforeEnter>
            {Boolean(pokemon?.nextPokemon?.id) && (
              <motion.span
                className="w-8 h-8 p-2 pr-0"
                key={pokemon?.nextPokemon?.slug || ""}
                variants={{
                  in: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
                  out: {
                    opacity: 0,
                    scale: 0.4,
                    transition: { duration: 0.1 },
                  },
                }}
                initial="out"
                animate="in"
                exit="out"
              >
                <PokeImg
                  slug={pokemon?.nextPokemon?.slug || ""}
                  id={pokemon?.nextPokemon?.id || ""}
                />
              </motion.span>
            )}
          </AnimatePresence>
          <span className="flex-grow flex justify-center p-2 overflow-hidden whitespace-no-wrap capitalize">
            {pokemon?.nextPokemon?.slug || "Pokedex"}
          </span>
          <span className="p-2 pl-0">
            <FaChevronRight />
          </span>
        </a>
      </Link>
    </div>
  );
};

const CardsSection: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  const [areCardsShown, setAreCardsShown] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);

  const onEsc = React.useCallback(() => {
    setSelectedCard(null);
  }, []);
  useKey("Escape", onEsc);

  return (
    <AnimateSharedLayout>
      <div>
        <div className="text-xl font-bold mb-2">Cards</div>
        <AnimatePresence>
          {areCardsShown && (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              variants={{
                in: {
                  opacity: 1,
                  height: "auto",
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
                out: {
                  height: 0,
                  opacity: 0,
                },
              }}
              initial="out"
              animate="in"
              exit="out"
            >
              {pokemon.cards.map((card) => (
                <motion.div
                  key={card.imageUrl}
                  className="relative rounded overflow-hidden shadow"
                  // S TODO: Extract this to a const
                  variants={{
                    in: {
                      opacity: 1,
                      y: 0,
                    },
                    out: {
                      opacity: 0,
                      y: 10,
                    },
                  }}
                  onClick={() => setSelectedCard(card)}
                >
                  <motion.img
                    src={card.imageUrl}
                    key={card.imageUrl}
                    width={240}
                    layoutId={card.imageUrl}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-40 px-2 py-1 text-white">
                    <div className="text-xs font-bold text-gray-200">
                      {card.series}
                    </div>
                    <div className="">{card.releaseDate}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {!areCardsShown && (
          <button
            onClick={() => setAreCardsShown(true)}
            className="block p-2 border-2 rounded w-full border-gray-600 text-gray-600 dark:border-gray-300 dark:text-gray-300"
          >
            Show cards
          </button>
        )}
      </div>
      {/* Modal */}
      <AnimatePresence>
        {Boolean(selectedCard) && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-10 flex justify-center items-center p-8"
            variants={{
              in: { opacity: 1 },
              out: { opacity: 0 },
            }}
            initial="out"
            animate="in"
            exit="out"
          >
            <div className="absolute inset-0 p-8">
              <motion.img
                srcSet={`${selectedCard.imageUrl} 100w, ${selectedCard.imageUrlHiRes} 480w`}
                layoutId={selectedCard.imageUrl}
                className="w-full h-full object-contain"
                style={{
                  filter: `drop-shadow(2px 4px 10px rgb(80, 80, 80))`,
                }}
              />
              <div className="absolute right-0 top-0 text-gray-700 p-3">
                <button
                  className="border-2 border-gray-700 rounded px-6 py-1 flex items-center bg-opacity-75 bg-white"
                  onClick={() => setSelectedCard(null)}
                >
                  Close
                  <FaTimes className="ml-2" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

/**
 * Determine color to use for pokemon
 */
const useColor = ({ pokemon }: PokemonDetailsProps) => {
  const { prefersDarkMode } = usePrefersDarkMode();

  return React.useMemo(() => {
    const [r, g, b] = prefersDarkMode
      ? pokemon?.colorPalette?.DarkVibrant ||
        pokemon?.colorPalette?.Vibrant ||
        pokemon?.colorPalette?.DarkMuted || [50, 50, 50]
      : pokemon?.colorPalette?.LightVibrant ||
        pokemon?.colorPalette?.Vibrant ||
        pokemon?.colorPalette?.LightMuted || [200, 200, 200];

    return `rgb(${r}, ${g}, ${b})`;
  }, [pokemon, prefersDarkMode]);
};

/**
 * Determine background color to use for pokemon
 */
const useBackgroundColor = ({ pokemon }: PokemonDetailsProps) => {
  const { prefersDarkMode } = usePrefersDarkMode();

  return React.useMemo(() => {
    if (!pokemon) return "";

    const [r, g, b] = prefersDarkMode
      ? pokemon?.colorPalette?.DarkVibrant ||
        pokemon?.colorPalette?.Vibrant ||
        pokemon?.colorPalette?.DarkMuted || [50, 50, 50]
      : pokemon?.colorPalette?.LightVibrant ||
        pokemon?.colorPalette?.Vibrant ||
        pokemon?.colorPalette?.LightMuted || [200, 200, 200];

    return tinycolor
      .mix(
        `rgb(${r}, ${g}, ${b})`,
        prefersDarkMode ? "black" : "white",
        prefersDarkMode ? 65 : 80,
      )
      .toRgbString();
  }, [pokemon, prefersDarkMode]);
};

/**
 * Set background color accordingly
 */
const useSetBackgroundColor = (bgColor = "") => {
  React.useEffect(() => {
    if (bgColor) {
      setBackgroundColor(bgColor);
    }
  }, [bgColor]);
};

export default PokemonDetails;

/**
 * Generate page for each pokemon
 */
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const slugs = getAllPokemonSlugs();

  return {
    paths: slugs.map((slug) => `/pokemon/${slug}`),
    fallback: false,
  };
};

/**
 * For each pokemon, pull the details
 */
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
