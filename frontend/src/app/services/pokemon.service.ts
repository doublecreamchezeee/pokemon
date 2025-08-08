import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface Pokemon {
  id: number;
  name: string;
  image: string;
}

interface PaginatedResponse<T> {
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
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private http: HttpClient) {}

  private getCacheKey(page: number, limit: number): string {
    return `pokemons_${page}_${limit}`;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  getPokemons(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Pokemon>> {
    const cacheKey = this.getCacheKey(page, limit);
    
    if (this.isCacheValid(cacheKey)) {
      return of(this.cache.get(cacheKey)!.data);
    }

    return this.http.get<PaginatedResponse<Pokemon>>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    ).pipe(
      tap(response => {
        this.cache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      })
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
