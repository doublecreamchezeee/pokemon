import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../pokemons/pokemon.service';

export interface FavoriteResponse {
  data: Pokemon[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getFavorites(userId: string): Observable<FavoriteResponse> {
    return this.http.get<FavoriteResponse>(`${this.apiUrl}/users/${userId}/favorites`);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorites/${id}`);
  }
}
