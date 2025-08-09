import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PokemonsQueryDto } from './dto/pokemons-query.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginatedPokemonResponse } from './interfaces/paginated-pokemon-response.interface';

@Injectable()
export class PokemonsService {
  constructor(private prisma: PrismaService) {}

  async findMany(query: PokemonsQueryDto): Promise<PaginatedPokemonResponse> {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: any = {};

    if (query.name) {
      where.name = {
        contains: query.name,
        mode: 'insensitive',
      };
    }

    if (query.type) {
      where.OR = [
        { type1: { contains: query.type, mode: 'insensitive' } },
        { type2: { contains: query.type, mode: 'insensitive' } },
      ];
    }

    if (query.legendary !== undefined) {
      where.legendary = query.legendary;
    }

    if (query.minSpeed !== undefined || query.maxSpeed !== undefined) {
      where.speed = {};
      if (query.minSpeed !== undefined) {
        where.speed.gte = query.minSpeed;
      }
      if (query.maxSpeed !== undefined) {
        where.speed.lte = query.maxSpeed;
      }
    }

    // Get total count
    const total = await this.prisma.pokemon.count({ where });

    // Get paginated results
    const dbItems = await this.prisma.pokemon.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    });

    const items: Pokemon[] = dbItems.map(item => ({
      id: item.id,
      name: item.name,
      type1: item.type1,
      type2: item.type2,
      total: item.total,
      hp: item.hp,
      attack: item.attack,
      defense: item.defense,
      spAtk: item.spAttack,
      spDef: item.spDefense,
      speed: item.speed,
      generation: item.generation,
      legendary: item.legendary,
      image: item.image || `assets/images/pokemon/${item.id}.png`,
      ...(item.ytbUrl && { ytUrl: item.ytbUrl })
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<Pokemon> {
    const item = await this.prisma.pokemon.findUniqueOrThrow({
      where: { id }
    });

    return {
      id: item.id,
      name: item.name,
      type1: item.type1,
      type2: item.type2,
      total: item.total,
      hp: item.hp,
      attack: item.attack,
      defense: item.defense,
      spAtk: item.spAttack,
      spDef: item.spDefense,
      speed: item.speed,
      generation: item.generation,
      legendary: item.legendary,
      image: item.image || `assets/images/pokemon/${item.id}.png`,
      ...(item.ytbUrl && { ytUrl: item.ytbUrl })
    };
  }
}
