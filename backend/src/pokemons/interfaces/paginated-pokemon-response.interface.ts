import { Pokemon } from '../entities/pokemon.entity';

export interface PaginatedPokemonResponse {
  items: Pokemon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
