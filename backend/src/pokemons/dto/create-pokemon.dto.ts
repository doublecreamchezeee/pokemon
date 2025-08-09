import { IsString, IsNumber, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class CreatePokemonDto {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    @IsString()
    type1: string;

    @IsString()
    @IsOptional()
    type2?: string;

    @IsNumber()
    total: number;

    @IsNumber()
    hp: number;

    @IsNumber()
    attack: number;

    @IsNumber()
    defense: number;

    @IsNumber()
    spAtk: number;

    @IsNumber()
    spDef: number;

    @IsNumber()
    speed: number;

    @IsNumber()
    generation: number;

    @IsBoolean()
    legendary: boolean;

    @IsString()
    @IsUrl()
    @IsOptional()
    image?: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    ytUrl?: string;
}

export class ImportPokemonDto {
    @IsOptional()
    pokemons: CreatePokemonDto[];
}
