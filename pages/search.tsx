import * as React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { getSearchList } from "../utils/data-wranglers";

type SearchProps = {
  searchList: ReturnType<typeof getSearchList>;
};

const Search: React.FC<SearchProps> = ({ searchList }) => {
  return (
    <div>
      <div>Search list!</div>
      {searchList.map((p) => (
        <div key={p.slug}>{p.slug}</div>
      ))}
    </div>
  );
};

export default Search;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ["/search"],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SearchProps> = async () => {
  const searchList = getSearchList();

  return {
    props: {
      searchList,
    },
  };
};
