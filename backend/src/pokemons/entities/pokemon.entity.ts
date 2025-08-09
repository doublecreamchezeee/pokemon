export interface Pokemon {
  id: number;
  name: string;
  type1: string;
  type2: string | null;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
  generation: number;
  legendary: boolean;
  image: string;
  ytUrl?: string;
}
