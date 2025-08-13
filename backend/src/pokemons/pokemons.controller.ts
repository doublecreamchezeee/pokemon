import { Controller, Get, Param, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsQueryDto } from './dto/pokemons-query.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  async findAll(@Query(new ValidationPipe({ transform: true })) query: PokemonsQueryDto) {
    return this.pokemonsService.findMany(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pokemonsService.findById(id);
  }
}
