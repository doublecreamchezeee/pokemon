export class PokemonResponse {
  id: number;
  name: string;
  type1: string;
  type2: string | null;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  image: string | null;
  ytbUrl: string | null;
}

export class PaginatedPokemonResponse {
  items: PokemonResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
