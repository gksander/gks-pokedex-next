export type PokeListPaginationInfo = {
  page: number;
  totalNumPages: number;
  pageSize: number;
  totalNumPokemon: number;
};

export type PokeListPokemon = {
  id: string;
  slug: string;
};
