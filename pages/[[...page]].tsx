import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { PokeListPaginationInfo } from "../types";
import { getSlimPokemonData } from "../utils/data-wranglers";
import { NUM_POKEMON, POKE_LIST_PAGE_SIZE } from "../config";
import { ViewWrapper } from "../components/ViewWrapper";
import {
  AnimatePresence,
  motion,
  useTransform,
  useViewportScroll,
} from "framer-motion";
import { PokeListCard } from "../components/PokeListCard";
import classNames from "classnames";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/router";
import { useKey } from "react-use";

type PokeListProps = {
  pageInfo: PokeListPaginationInfo;
  pokemon: ReturnType<typeof getSlimPokemonData>[];
};

const PokeList: React.FC<PokeListProps> = ({ pageInfo, pokemon }) => {
  // Pagination details
  const numPokemon = pageInfo.totalNumPokemon;
  const pageSize = pageInfo.pageSize;
  const currentPage = pageInfo.page;
  const minId = (currentPage - 1) * pageSize + 1;
  const maxId = Math.min(currentPage * pageSize, numPokemon);
  const totalNumPages = pageInfo.totalNumPages;

  useBindKeyHandlers({ pageInfo });

  const { scrollYProgress } = useViewportScroll();
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <ViewWrapper>
      <div>
        <Head>
          <title>GKS Pokedex</title>
          <meta
            name="description"
            content={`Pokemon list, page ${currentPage}`}
          />
        </Head>
        <AnimatePresence initial={false}>
          {currentPage === 1 && (
            <motion.div
              variants={{
                in: { opacity: 1, height: "auto" },
                out: { opacity: 0, height: 0 },
              }}
              initial="out"
              animate="in"
              exit="out"
            >
              <div className="text-5xl font-fancy">Grant's Pokedex</div>
              <div>
                A list of all pokemon (through generation 5), proudly powered by{" "}
                <a
                  href="https://github.com/PokeAPI/pokeapi"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-800"
                >
                  the Open PokeAPI
                </a>{" "}
                and{" "}
                <a
                  href="https://veekun.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-800"
                >
                  Veekun
                </a>
                . Built with{" "}
                <a
                  href="https://nextjs.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-800"
                >
                  Next.JS
                </a>{" "}
                and styled with the almighty{" "}
                <a
                  href="https://tailwindcss.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-800"
                >
                  TailwindCSS
                </a>
                . Check out{" "}
                <a
                  href="https://github.com/gksander/gks-pokedex-react"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-800"
                >
                  the source code
                </a>{" "}
                on GitHub. This is a pet project, and I claim no commercial or
                intellectual rights to any of the Pokemon-specific resources
                (such as data or images) used here.
              </div>
              <div className="h-12" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            initial="out"
            animate="in"
            exit="out"
            variants={{
              in: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <div className="grid gap-16">
              {pokemon.map((p) => (
                <motion.div
                  variants={{
                    out: {
                      y: 5,
                      opacity: 0,
                      transition: { duration: 0.05 },
                    },
                    in: {
                      y: 0,
                      opacity: 1,
                    },
                  }}
                  key={p.slug}
                >
                  <PokeListCard key={p.id} pokemon={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="h-12" />
        <div className="sticky bottom-0 py-1 bg-white border-t flex items-center">
          {(() => {
            const isDisabled = currentPage < 2;
            const href = isDisabled
              ? `/`
              : currentPage === 2
              ? "/"
              : `/${currentPage - 1}`;

            return (
              <BottomLink href={href} isDisabled={isDisabled}>
                <FaChevronLeft />
                <span className="w-1" />
                <span>Previous</span>
              </BottomLink>
            );
          })()}
          <div className="flex-grow text-sm flex justify-center">
            <div className="flex flex-col">
              <div>
                #{minId} - #{maxId}
                <span className="hidden sm:inline"> of #{numPokemon}</span>
              </div>
              <motion.div
                className="bg-primary-600 h-1 rounded-full"
                style={{ width: barWidth }}
              />
            </div>
          </div>
          {(() => {
            const isDisabled = currentPage === totalNumPages;
            const href = isDisabled ? `/` : `/${currentPage + 1}`;

            return (
              <BottomLink href={href} isDisabled={isDisabled}>
                <span>Next</span>
                <span className="w-1" />
                <FaChevronRight />
              </BottomLink>
            );
          })()}
        </div>
      </div>
    </ViewWrapper>
  );
};

const BottomLink: React.FC<{ href: string; isDisabled: boolean }> = ({
  href,
  isDisabled,
  children,
}) => {
  const className = classNames(
    "flex items-center rounded py-2 px-3 hover:bg-gray-100",
    isDisabled
      ? "disabled cursor-not-allowed text-gray-500"
      : "hover:bg-gray-100 cursor-pointer",
  );

  if (!isDisabled) {
    return (
      <Link href={href} passHref>
        <a className={className}>{children}</a>
      </Link>
    );
  } else {
    return (
      <span>
        <span className={className}>{children}</span>
      </span>
    );
  }
};

const useBindKeyHandlers = ({ pageInfo }: Pick<PokeListProps, "pageInfo">) => {
  const currentPage = pageInfo?.page;
  const totalNumPages = pageInfo?.totalNumPages;
  const router = useRouter();

  const goPrev = () => {
    if (currentPage && currentPage > 1) {
      router.push(currentPage === 2 ? "/" : `/${currentPage - 1}`);
    }
  };
  useKey("ArrowLeft", goPrev, {}, [currentPage]);

  const goNext = () => {
    if (currentPage && totalNumPages && currentPage < totalNumPages) {
      router.push(`/${currentPage + 1}`);
    }
  };
  useKey("ArrowRight", goNext, {}, [currentPage]);
};

/**
 * Paths to generate
 */
export const getStaticPaths: GetStaticPaths<{ page: string }> = async () => {
  const NUM_PAGES = Math.ceil(NUM_POKEMON / POKE_LIST_PAGE_SIZE);
  const paths = ["/"].concat(
    Array.from({ length: NUM_PAGES - 1 }).map((_, i) => `/${i + 2}`),
  );

  return {
    paths,
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
    .filter((i) => i <= NUM_POKEMON)
    .map((id) => getSlimPokemonData({ id: String(id) }));

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
