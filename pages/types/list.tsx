import * as React from "react";
import { GetStaticProps } from "next";
import { getAllTypes } from "../../utils/data-wranglers";
import { ViewWrapper } from "../../components/ViewWrapper";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { PokeTypeChip } from "../../components/PokeTypeChip";
import Head from "next/head";

type TypesListProps = {
  types: ReturnType<typeof getAllTypes>;
};

const TypesList: React.FC<TypesListProps> = ({ types }) => {
  return (
    <ViewWrapper>
      <Head>
        <title>Types List</title>
        <meta name="description" content={`Pokemon types list`} />
      </Head>
      <div className="container max-w-2xl py-6 px-2">
        <div className="text-3xl font-bold">Types</div>
        <div className="mb-4 text-gray-700">
          Select a type to learn more about it.
        </div>
        <AnimatePresence exitBeforeEnter>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            initial="out"
            animate="in"
            exit="out"
            variants={list}
          >
            {(types || []).map((type) => (
              <motion.div key={type.slug} variants={chip}>
                <PokeTypeChip slug={type.slug} isBlock key={type.slug} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </ViewWrapper>
  );
};

const list: Variants = {
  in: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.03,
    },
  },
  out: { opacity: 0 },
};

const chip: Variants = {
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: 20 },
};

export default TypesList;

export const getStaticProps: GetStaticProps<TypesListProps> = async () => {
  return {
    props: {
      types: getAllTypes(),
    },
  };
};
