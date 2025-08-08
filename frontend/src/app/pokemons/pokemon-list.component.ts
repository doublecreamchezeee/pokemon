import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PokemonService, Pokemon, PaginatedResponse } from './pokemon.service';
import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { catchError, finalize, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PokemonCardComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm = '';
  selectedFile: File | null = null;
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.applyFilter(value || '');
    });
  }

  loadPokemons() {
    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPokemons(1, 20).pipe(
      catchError(error => {
        this.error = 'Failed to load Pokémon. Please try again later.';
        return of({ data: [], total: 0, page: 1, limit: 20 } as PaginatedResponse<Pokemon>);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
      this.pokemons = response.data;
      this.applyFilter();
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile.name);
      // TODO: Implement CSV upload
    }
  }

  onSearch() {
    this.applyFilter();
  }

  private applyFilter(searchTerm: string = '') {
    const term = searchTerm.toLowerCase().trim();
    this.filteredPokemons = this.pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term)
    );
  }
}
