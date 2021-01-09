import * as React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { getAllTypes, getTypeBySlug } from "../../utils/data-wranglers";
import { ViewWrapper } from "../../components/ViewWrapper";
import { PokeTypeChip } from "../../components/PokeTypeChip";
import { PokeListCard } from "../../components/PokeListCard";
import Head from "next/head";
import { titleCase } from "../../utils/titleCase";

type TypeDetailsProps = {
  type: ReturnType<typeof getTypeBySlug>;
};

const TypeDetails: React.FC<TypeDetailsProps> = ({ type }) => {
  const damageCategories = (() => {
    const superEffectiveAgainst = (type?.efficacyTo || [])
      .filter((dat) => dat.factor === 200)
      .map((dat) => dat.type);
    const notVeryEffectiveAgainst = (type?.efficacyTo || [])
      .filter((dat) => dat.factor === 50)
      .map((dat) => dat.type);
    const notEffectiveAgainst = (type?.efficacyTo || [])
      .filter((dat) => dat.factor === 0)
      .map((dat) => dat.type);

    return [
      {
        title: "Strong Against",
        types: superEffectiveAgainst,
      },
      {
        title: "Weak Against",
        types: notVeryEffectiveAgainst,
      },
      {
        title: "Doesn't Affect",
        types: notEffectiveAgainst,
      },
    ];
  })();

  return (
    <ViewWrapper>
      <Head>
        <title>{titleCase(type.slug)} - Details</title>
        <meta
          name="description"
          content={`Type details for ${titleCase(type.slug)}`}
        />
      </Head>
      <div className="container max-w-2xl py-6 px-2">
        <div className="text-6xl font-fancy mb-3 capitalize">{type.slug}</div>
        <div className="grid gap-6">
          {damageCategories.map((cat) => (
            <div key={cat.title}>
              <div className="text-3xl font-thin mb-1">{cat.title}</div>
              {(() => {
                if (!cat.types.length) {
                  return (
                    <div className="italic text-gray-700 dark:text-gray-300">
                      Nothing...
                    </div>
                  );
                }

                return (
                  <div className="flex flex-wrap">
                    {cat.types.map((slug) => (
                      <div className="mr-1 mb-1" key={slug}>
                        <PokeTypeChip slug={slug} />
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
        <hr className="my-6" />
        <div className="text-4xl font-thin mb-4">Pokemon with this type</div>
        <div className="grid gap-8">
          {(type?.pokemon || []).map((pokemon) => (
            <PokeListCard pokemon={pokemon} key={pokemon.slug} />
          ))}
        </div>
      </div>
    </ViewWrapper>
  );
};

export default TypeDetails;

/**
 * Generate paths
 */
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const types = getAllTypes();

  return {
    paths: types.map((type) => `/types/${type.slug}`),
    fallback: false,
  };
};

/**
 * For each type, get type details
 */
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
