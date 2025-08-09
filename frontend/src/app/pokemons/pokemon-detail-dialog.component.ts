import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, map } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from './pokemon.interface';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pokemon-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule, SafeUrlPipe],
  templateUrl: './pokemon-detail-dialog.component.html',
  styleUrls: ['./pokemon-detail-dialog.component.scss']
})
export class PokemonDetailDialogComponent {
  pokemon$: Observable<Pokemon>;

  constructor(
    private dialogRef: MatDialogRef<PokemonDetailDialogComponent>,
    private pokemonService: PokemonService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) private data: { id: number }
  ) {
    this.pokemon$ = this.pokemonService.getPokemon(data.id).pipe(
      map(pokemon => ({
        ...pokemon,
        ytUrl: pokemon.ytUrl ? this.getYouTubeEmbedUrl(pokemon.ytUrl) : undefined
      }))
    );
  }

  private getYouTubeEmbedUrl(url: string): string {
    // Handle youtu.be links
    const youtubeIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (!youtubeIdMatch) return url;
    
    const videoId = youtubeIdMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}
