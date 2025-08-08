import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonListComponent } from './pokemon-list.component';

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [CommonModule, PokemonListComponent],
  template: `
    <app-pokemon-list></app-pokemon-list>
  `
})
export class PokemonsComponent {}
