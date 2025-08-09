import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { FavoritesService } from '../services/favorites.service';
import { Pokemon } from '../pokemons/pokemon.interface';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PokemonDetailDialogComponent } from '../pokemons/pokemon-detail-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PokemonCardComponent,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: Pokemon[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFavorites();
    
    // Subscribe to favorites changes to update the list when items are removed
    this.favoritesService.favorites$.subscribe(favorites => {
      if (!this.isLoading) {
        // Filter out items that are no longer in favorites
        this.favorites = this.favorites.filter(pokemon => favorites.has(pokemon.id));
      }
    });
  }

  loadFavorites() {
    this.isLoading = true;
    this.error = null;

    this.favoritesService.getFavoritesWithDetails().pipe(
      finalize(() => this.isLoading = false),
      catchError(error => {
        this.error = 'Failed to load favorites';
        return of({items: [], total: 0});
      })
    ).subscribe((response: { items: Pokemon[]; total: number }) => {
      this.favorites = response.items;
    });
  }

  openPokemonDetails(pokemon: Pokemon): void {
    this.dialog.open(PokemonDetailDialogComponent, {
      data: { id: pokemon.id },
      width: '600px',
      maxHeight: '90vh',
      panelClass: 'pokemon-detail-dialog'
    });
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  removeFavorite(pokemon: Pokemon) {
    this.favoritesService.toggleFavorite(pokemon).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(p => p.id !== pokemon.id);
        this.snackBar.open(`Removed ${pokemon.name} from favorites`, 'Close', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Failed to remove from favorites', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
