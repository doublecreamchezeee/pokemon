import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Pokemon, PaginatedPokemonResponse } from '../pokemons/pokemon.interface';
import { environment } from '@environments/environment';

export type { Pokemon, PaginatedPokemonResponse };

export interface PokemonFilters {
  name?: string;
  type?: string;
  legendary?: boolean;
  minSpeed?: number;
  maxSpeed?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = `${environment.apiUrl}/api/pokemons`;
  private cache: Map<string, { data: PaginatedPokemonResponse; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  private getCacheKey(page: number, limit: number, filters?: PokemonFilters): string {
    let key = `pokemons_${page}_${limit}`;
    if (filters) {
      key += '_' + JSON.stringify(filters);
    }
    return key;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status === 0 
        ? 'Could not connect to the server'
        : `Error: ${error.error.message || error.statusText}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getPokemons(
    page: number = 1, 
    limit: number = 20,
    filters?: PokemonFilters
  ): Observable<PaginatedPokemonResponse> {
    const cacheKey = this.getCacheKey(page, limit, filters);
    
    if (this.isCacheValid(cacheKey)) {
      return of(this.cache.get(cacheKey)!.data);
    }

    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());
    
    if (filters) {
      if (filters.name) params.set('name', filters.name);
      if (filters.type) params.set('type', filters.type);
      if (filters.legendary !== undefined) params.set('legendary', filters.legendary.toString());
      if (filters.minSpeed !== undefined) params.set('minSpeed', filters.minSpeed.toString());
      if (filters.maxSpeed !== undefined) params.set('maxSpeed', filters.maxSpeed.toString());
    }

    const url = `${this.apiUrl}?${params.toString()}`;

    return this.http.get<PaginatedPokemonResponse>(url).pipe(
      tap(response => {
        this.cache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      }),
      catchError(this.handleError)
    );
  }

  getPokemon(id: number): Observable<Pokemon> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Pokemon>(url).pipe(
      catchError(this.handleError)
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
