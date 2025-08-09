import { Module } from '@nestjs/common';
import { PokemonsController } from './pokemons.controller';
import { PokemonsImportController } from './pokemons-import.controller';
import { PokemonsService } from './pokemons.service';

@Module({
  controllers: [PokemonsController, PokemonsImportController],
  providers: [PokemonsService],
  exports: [PokemonsService],
})
export class PokemonsModule {}
