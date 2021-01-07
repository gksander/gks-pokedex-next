import * as React from "react";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllTypes } from "../../utils/data-wranglers";

type TypesListProps = {
  types: ReturnType<typeof getAllTypes>;
};

const TypesList: React.FC<TypesListProps> = ({ types }) => {
  return (
    <div>
      <h1>Types list!</h1>
      {types.map((type) => (
        <div>
          <Link href={`/types/${type.slug}`}>{type.slug}</Link>
        </div>
      ))}
    </div>
  );
};

export default TypesList;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ["/types/list"],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TypesListProps> = async () => {
  return {
    props: {
      types: getAllTypes(),
    },
  };
};
