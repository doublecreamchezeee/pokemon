import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { PokemonService, Pokemon } from '../services/pokemon.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { PokemonDetailDialogComponent } from '../pokemons/pokemon-detail-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PokemonCardComponent,
    MatGridListModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  youtubeVideos = [
    'https://www.youtube.com/embed/1roy4o4tqQM',
    'https://www.youtube.com/embed/uBYORdr_TY8',
    'https://www.youtube.com/embed/8r7Jk6zT1dE',
    'https://www.youtube.com/embed/rg6CiPI6h2g'
  ];

  pokemons: Pokemon[] = [];
  isLoading = true;
  error: string | null = null;
  favoritePokemons: Set<number> = new Set();

  constructor(
    private pokemonService: PokemonService,
    private dialog: MatDialog
  ) {}

  openPokemonDialog(pokemon: Pokemon): void {
    this.dialog.open(PokemonDetailDialogComponent, {
      data: { id: pokemon.id },
      panelClass: 'pokemon-dialog'
    });
  }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPokemons(1, 10).pipe(
      catchError(error => {
        this.error = 'Failed to load Pokémon. Please try again later.';
        return of({ items: [], total: 0, page: 1, limit: 10, totalPages: 1 });
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
      this.pokemons = response.items;
    });
  }

  openPokemonDetails(pokemon: Pokemon): void {
    // TODO: Implement navigation to pokemon details page
    console.log('Opening details for:', pokemon.name);
  }

  toggleFavorite(pokemon: Pokemon): void {
    if (this.favoritePokemons.has(pokemon.id)) {
      this.favoritePokemons.delete(pokemon.id);
    } else {
      this.favoritePokemons.add(pokemon.id);
    }
    // TODO: Implement actual favorite toggling with backend
    console.log('Toggled favorite for:', pokemon.name);
  }

  isFavorite(id: number): boolean {
    return this.favoritePokemons.has(id);
  }
}
