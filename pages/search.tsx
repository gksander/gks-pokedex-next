import * as React from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSearchList } from "../utils/data-wranglers";
import { ViewWrapper } from "../components/ViewWrapper";
import { PokeImg } from "../components/PokeImg";
import { FaChevronRight } from "react-icons/fa";
import Head from "next/head";

type SearchProps = {
  searchList: ReturnType<typeof getSearchList>;
};

const Search: React.FC<SearchProps> = ({ searchList }) => {
  const [query, setQuery] = React.useState("");
  const filteredPokemon = React.useMemo(() => {
    const reg = new RegExp(query.replace(/W/i, ""), "i");
    return (searchList || []).filter((p) => reg.test(p.slug)).slice(0, 10);
  }, [searchList, query]);

  return (
    <ViewWrapper>
      <Head>
        <title>Pokemon Search</title>
        <meta name="description" content={`Search pokemon by name`} />
      </Head>
      <div className="container max-w-2xl px-2 py-6">
        <div className="text-5xl font-fancy mb-6">Search for a Pokemon</div>
        <div className="border-2 border-gray-800 rounded overflow-hidden">
          <label aria-label="Search">
            <input
              type="text"
              className="p-3 w-full text-xl outline-none bg-gray-50 dark:bg-gray-900"
              placeholder="Mew"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              name="search"
            />
          </label>
          <motion.div animate={{ height: "auto" }}>
            {filteredPokemon.map((p) => (
              (<Link
                href={`/pokemon/${p.slug}`}
                key={p.slug}
                passHref
                className="block p-3 flex items-center bg-gray-50 dark:bg-gray-900 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors duration-150">

                <div className="flex-grow flex items-center">
                  <div className="w-8 mr-3">
                    <div className="w-full">
                      <PokeImg
                        slug={p.slug}
                        id={p.id}
                        imgClassName="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="font-bold text-gray-700 dark:text-gray-200 capitalize">
                    #{p.id} - {p.slug}
                  </div>
                </div>
                <FaChevronRight />

              </Link>)
            ))}
          </motion.div>
        </div>
      </div>
    </ViewWrapper>
  );
};

export default Search;

/**
 * Pull search list
 */
export const getStaticProps: GetStaticProps<SearchProps> = async () => {
  const searchList = getSearchList();

  return {
    props: {
      searchList,
    },
  };
};
