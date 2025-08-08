import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { PokemonService, Pokemon } from '../services/pokemon.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent, MatGridListModule, SafeUrlPipe],
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

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPokemons(1, 10).pipe(
      catchError(error => {
        this.error = 'Failed to load Pokémon. Please try again later.';
        return of({ data: [], total: 0, page: 1, limit: 10 });
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
      this.pokemons = response.data;
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
