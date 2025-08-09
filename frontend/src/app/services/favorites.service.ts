import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pokemon } from '../pokemons/pokemon.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Set<number>>(new Set());
  favorites$ = this.favoritesSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/api/favorites`;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.loadFavorites();
  }

  private loadFavorites() {
    // Get current user's favorites
    this.http.get<{ items: Pokemon[]; total: number }>(`${this.apiUrl}/users/me`).pipe(
      tap(response => {
        const favoriteIds = new Set(response.items.map(p => p.id));
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
      : this.http.post<void>(`${this.apiUrl}/${pokemon.id}`, {});

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
          
          let errorMessage = 'Failed to update favorites';
          if (error.status === 409) {
            errorMessage = 'Pokemon is already in favorites';
          } else if (error.status === 404) {
            errorMessage = 'Pokemon not found in favorites';
          }
          
          this.snackBar.open(errorMessage, 'Close', { 
            duration: 3000 
          });
        }
      })
    );
  }

  getFavoritesWithDetails(): Observable<{ items: Pokemon[]; total: number }> {
    return this.http.get<{ items: Pokemon[]; total: number }>(`${this.apiUrl}/users/me`);
  }
}
