import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  sprite?: string;
  types: string[];
  stats: PokemonStats;
  height?: number;
  weight?: number;
  description?: string;
  speed?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = `${environment.apiUrl}/api/pokemons`;

  constructor(private http: HttpClient) {}

  getPokemons(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Pokemon>> {
    return this.http.get<PaginatedResponse<Pokemon>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    ).pipe(
      map(response => ({
        ...response,
        data: response.data.map(pokemon => ({
          ...pokemon,
          sprite: pokemon.image, // Ensure both image and sprite are available
          speed: pokemon.stats.speed // Extract speed for card display
        }))
      }))
    );
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${id}`);
  }
}
