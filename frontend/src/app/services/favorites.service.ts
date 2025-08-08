import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pokemon } from '../pokemons/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Set<number>>(new Set());
  favorites$ = this.favoritesSubject.asObservable();
  private apiUrl = '/api/favorites';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.http.get<Pokemon[]>(this.apiUrl).pipe(
      tap(pokemons => {
        const favoriteIds = new Set(pokemons.map(p => p.id));
        this.favoritesSubject.next(favoriteIds);
      })
    ).subscribe();
  }

  isFavorite(pokemonId: number): Observable<boolean> {
    return this.favorites$.pipe(
      map(favorites => favorites.has(pokemonId))
    );
  }

  toggleFavorite(pokemon: Pokemon): Observable<void> {
    const isFavorite = this.favoritesSubject.value.has(pokemon.id);
    const newFavorites = new Set(this.favoritesSubject.value);

    // Optimistic update
    if (isFavorite) {
      newFavorites.delete(pokemon.id);
    } else {
      newFavorites.add(pokemon.id);
    }
    this.favoritesSubject.next(newFavorites);

    const request = isFavorite
      ? this.http.delete<void>(`${this.apiUrl}/${pokemon.id}`)
      : this.http.post<void>(this.apiUrl, pokemon);

    return request.pipe(
      tap({
        next: () => {
          const message = isFavorite
            ? 'Removed from favorites'
            : 'Added to favorites';
          this.snackBar.open(message, 'Close', { duration: 3000 });
        },
        error: (error) => {
          // Revert optimistic update on error
          if (isFavorite) {
            newFavorites.add(pokemon.id);
          } else {
            newFavorites.delete(pokemon.id);
          }
          this.favoritesSubject.next(newFavorites);
          
          this.snackBar.open('Failed to update favorites', 'Close', { 
            duration: 3000 
          });
        }
      })
    );
  }
}
