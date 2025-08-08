export interface Pokemon {
  id: number;
  name: string;
  image: string;  // Used in the card component
  sprite?: string; // Used in the detail view
  types?: string[];
  height?: number;
  weight?: number;
  stats?: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  speed?: number; // Simplified speed property for card display
}
