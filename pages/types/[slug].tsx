import * as React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllTypes, getTypeBySlug } from "../../utils/data-wranglers";

type TypeDetailsProps = {
  type: ReturnType<typeof getTypeBySlug>;
};

const TypeDetails: React.FC<TypeDetailsProps> = ({ type }) => {
  return (
    <div>
      <div>{type.slug}</div>
      {type.pokemon.map((p) => (
        <div key={p.slug}>{p.slug}</div>
      ))}
    </div>
  );
};

export default TypeDetails;

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const types = getAllTypes();

  return {
    paths: types.map((type) => `/types/${type.slug}`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  TypeDetailsProps,
  { slug: string }
> = async ({ params }) => {
  const slug = params?.slug || "";
  const type = getTypeBySlug({ slug });

  return {
    props: { type },
  };
};
