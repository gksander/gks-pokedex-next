import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
} from "@urql/core";

declare global {
  interface Window {
    __URQL_DATA__: Record<string, unknown>;
  }
}

const isServerSide = typeof window === "undefined";

const ssr = ssrExchange({
  isClient: !isServerSide,
  initialState: !isServerSide ? window.__URQL_DATA__ : undefined,
});

export const client = createClient({
  url: "https://beta.pokeapi.co/graphql/v1beta",
  exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
});
