import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PokemonCardComponent, MatGridListModule, SafeUrlPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  youtubeVideos = [
    'https://www.youtube.com/embed/1roy4o4tqQM',
    'https://www.youtube.com/embed/uBYORdr_TY8',
    'https://www.youtube.com/embed/8r7Jk6zT1dE',
    'https://www.youtube.com/embed/rg6CiPI6h2g'
  ];

  pokemons = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Pokemon ${i + 1}`,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`
  }));
}
