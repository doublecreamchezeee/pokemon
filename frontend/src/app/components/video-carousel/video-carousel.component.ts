import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { Pokemon } from '../../pokemons/pokemon.interface';

interface VideoItem {
  pokemon: Pokemon;
  embedUrl: string;
}

@Component({
  selector: 'app-video-carousel',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './video-carousel.component.html',
  styleUrls: ['./video-carousel.component.scss']
})
export class VideoCarouselComponent implements OnInit, OnChanges {
  @Input() videos: string[] = []; // Keep for backward compatibility
  @Input() pokemons: Pokemon[] = []; // New input for Pokemon with ytbUrl
  
  videoItems: VideoItem[] = [];
  currentIndex = 0;

  ngOnInit() {
    this.processVideoData();
  }

  ngOnChanges() {
    this.processVideoData();
  }

  private processVideoData() {
    // If we have Pokemon data with ytbUrl, use that
    if (this.pokemons && this.pokemons.length > 0) {
      this.videoItems = this.pokemons
        .filter(pokemon => pokemon.ytUrl) // Only include Pokemon with video URLs
        .slice(0, 4) // Limit to 4 videos maximum
        .map(pokemon => ({
          pokemon,
          embedUrl: this.getYouTubeEmbedUrl(pokemon.ytUrl!)
        }));
    }
    // Otherwise, fall back to the old videos array for backward compatibility
    else if (this.videos && this.videos.length > 0) {
      this.videoItems = this.videos
        .slice(0, 4) // Limit to 4 videos maximum
        .map((url, index) => ({
          pokemon: {
            id: index,
            name: `Video ${index + 1}`,
            type1: 'Unknown',
            total: 0,
            hp: 0,
            attack: 0,
            defense: 0,
            spAtk: 0,
            spDef: 0,
            speed: 0,
            generation: 1,
            legendary: false,
            image: ''
          } as Pokemon,
          embedUrl: url
        }));
    }
    
    // Reset current index if needed
    if (this.currentIndex >= this.videoItems.length) {
      this.currentIndex = 0;
    }
  }

  private getYouTubeEmbedUrl(url: string): string {
    // Handle youtu.be links and youtube.com links
    const youtubeIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (!youtubeIdMatch) return url;
    
    const videoId = youtubeIdMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  nextVideo() {
    if (this.videoItems.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.videoItems.length;
    }
  }

  prevVideo() {
    if (this.videoItems.length > 0) {
      this.currentIndex = this.currentIndex === 0 ? this.videoItems.length - 1 : this.currentIndex - 1;
    }
  }

  goToVideo(index: number) {
    if (index >= 0 && index < this.videoItems.length) {
      this.currentIndex = index;
    }
  }

  get hasVideos(): boolean {
    return this.videoItems.length > 0;
  }

  get currentVideoItem(): VideoItem | null {
    return this.videoItems.length > 0 ? this.videoItems[this.currentIndex] : null;
  }
}
