import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types?: string[];
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
  private apiUrl = '/api/pokemons';

  constructor(private http: HttpClient) {}

  getPokemons(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Pokemon>> {
    return this.http.get<PaginatedResponse<Pokemon>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }
}
