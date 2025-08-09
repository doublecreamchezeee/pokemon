import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsQueryDto } from './dto/pokemons-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('pokemons')
@UseGuards(JwtAuthGuard)
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
