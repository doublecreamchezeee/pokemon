import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../pokemons/pokemon.interface';
import { environment } from '@environments/environment';

export interface FavoriteResponse {
  items: Pokemon[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getFavorites(userId: string): Observable<FavoriteResponse> {
    return this.http.get<FavoriteResponse>(`${this.apiUrl}/favorites/users/${userId}`);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorites/${id}`);
  }
}
