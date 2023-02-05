import gql from "graphql-tag";

export const GET_POKEMON_LIST_QUERY = gql`
  query GetAllPokemon($limit: Int, $offset: Int) {
    pokemon: pokemon_v2_pokemonspecies(
      order_by: { id: asc }
      limit: $limit
      offset: $offset
    ) {
      name
      id
      pokemon: pokemon_v2_pokemons_aggregate(limit: 1) {
        nodes {
          name
          id
          types: pokemon_v2_pokemontypes {
            slot
            type: pokemon_v2_type {
              id
              name
            }
          }
        }
      }
      flavorText: pokemon_v2_pokemonspeciesflavortexts(
        where: { pokemon_v2_language: { name: { _eq: "en" } } }
        limit: 1
      ) {
        flavor_text
      }
      color: pokemon_v2_pokemoncolor {
        name
      }
    }
  }
`;
