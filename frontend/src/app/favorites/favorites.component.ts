import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { FavoritesService } from './favorites.service';
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
  // TODO: Get actual user ID from auth service
  userId = '1';

  constructor(
    private favoritesService: FavoritesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.error = null;

    this.favoritesService.getFavorites(this.userId).pipe(
      catchError(error => {
        this.error = 'Failed to load favorites. Please try again later.';
        return of({ items: [], total: 0 });
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
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

  removeFavorite(pokemon: Pokemon) {
    this.isLoading = true;
    this.favoritesService.removeFavorite(pokemon.id).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
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
