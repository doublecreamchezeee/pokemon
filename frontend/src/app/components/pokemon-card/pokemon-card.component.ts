import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Pokemon } from '../../pokemons/pokemon.interface';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent implements OnInit {
  @Input() pokemon!: Pokemon;
  @Input() showFavorite: boolean = true;
  isFavorite: boolean = false;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    // Subscribe to favorites changes and update the favorite state
    this.favoritesService.favorites$.subscribe(favorites => {
      this.isFavorite = favorites.has(this.pokemon.id);
    });
  }

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    
    this.favoritesService.toggleFavorite(this.pokemon).subscribe({
      next: () => {
        // The subscription to favorites$ will handle the UI update
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
      }
    });
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/pokemon-placeholder.png';
  }
}
