import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Pokemon } from './pokemon.interface';
import { PokemonService, PokemonFilters } from '../services/pokemon.service';
import { AuthStateService } from '../services/auth-state.service';
import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { catchError, finalize, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PokemonDetailDialogComponent } from './pokemon-detail-dialog.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    PokemonCardComponent, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  isLoading = true;
  error: string | null = null;
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  total = 0;
  filterForm: FormGroup;
  isImporting = false;
  pageSizeOptions = [10, 20, 50, 100];
  isAuthenticated$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  typeOptions = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
    'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
    'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
  ];

  constructor(
    private pokemonService: PokemonService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authState: AuthStateService
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      type: [''],
      legendary: [null],
      minSpeed: [null],
      maxSpeed: [null]
    });
    
    this.isAuthenticated$ = this.authState.isAuthenticated$;
  }

  ngOnInit() {
    this.loadPokemons();

    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadPokemons();
    });
  }

  loadPokemons() {
    this.isLoading = true;
    this.error = null;

    const filters: PokemonFilters = {};
    const formValue = this.filterForm.value;
    
    if (formValue.name) filters.name = formValue.name;
    if (formValue.type) filters.type = formValue.type;
    if (formValue.legendary !== null) filters.legendary = formValue.legendary;
    if (formValue.minSpeed !== null) filters.minSpeed = formValue.minSpeed;
    if (formValue.maxSpeed !== null) filters.maxSpeed = formValue.maxSpeed;

    this.pokemonService.getPokemons(this.currentPage, this.pageSize, filters).pipe(
      catchError(error => {
        this.error = 'Failed to load Pokémon. Please try again later.';
        return of({ items: [], total: 0, page: 1, limit: this.pageSize, totalPages: 0 });
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(response => {
      this.pokemons = response.items;
      this.total = response.total;
      this.totalPages = response.totalPages;
      this.currentPage = response.page;
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

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPokemons();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPokemons();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      name: '',
      type: '',
      legendary: null,
      minSpeed: null,
      maxSpeed: null
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.importCsv(file);
    }
  }

  importCsv(file: File): void {
    if (!file.name.endsWith('.csv')) {
      this.snackBar.open('Please select a CSV file', 'Close', { duration: 3000 });
      return;
    }

    this.isImporting = true;
    this.pokemonService.importCsv(file).subscribe({
      next: (response: { imported: number; message: string }) => {
        this.snackBar.open(response.message, 'Close', { 
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.loadPokemons(); // Reload the list
      },
      error: (error: any) => {
        console.error('Import error:', error);
        const message = error.error?.message || 'Failed to import CSV file';
        this.snackBar.open(message, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      },
      complete: () => {
        this.isImporting = false;
        // Clear the file input
        const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('csv-file-input');
    if (fileInput) {
      fileInput.click();
    }
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1; // Reset to first page
    this.loadPokemons();
  }
}
