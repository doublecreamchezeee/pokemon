import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PokemonService, Pokemon } from './pokemon.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pokemon-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './pokemon-detail-dialog.component.html',
  styleUrls: ['./pokemon-detail-dialog.component.scss']
})
export class PokemonDetailDialogComponent {
  pokemon$: Observable<Pokemon>;

  constructor(
    private dialogRef: MatDialogRef<PokemonDetailDialogComponent>,
    private pokemonService: PokemonService,
    @Inject(MAT_DIALOG_DATA) private data: { id: number }
  ) {
    this.pokemon$ = this.pokemonService.getPokemonById(data.id);
  }

  close(): void {
    this.dialogRef.close();
  }
}
