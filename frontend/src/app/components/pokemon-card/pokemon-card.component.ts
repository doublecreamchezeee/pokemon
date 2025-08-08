import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types?: string[];
  speed?: number;
}

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon!: Pokemon;
  @Input() showFavorite: boolean = false;
  @Output() favoriteToggle = new EventEmitter<void>();

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.favoriteToggle.emit();
  }
}
