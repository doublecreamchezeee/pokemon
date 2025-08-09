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

  async importFromCsv(buffer: Buffer): Promise<{ imported: number; message: string }> {
    const csvContent = buffer.toString('utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    let importedCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      if (values.length < headers.length) continue;
      
      try {
        const pokemonData = {
          id: parseInt(values[0]),
          name: values[1]?.replace(/"/g, ''),
          type1: values[2]?.replace(/"/g, ''),
          type2: values[3]?.replace(/"/g, '') || null,
          total: parseInt(values[4]) || 0,
          hp: parseInt(values[5]) || 0,
          attack: parseInt(values[6]) || 0,
          defense: parseInt(values[7]) || 0,
          spAttack: parseInt(values[8]) || 0,
          spDefense: parseInt(values[9]) || 0,
          speed: parseInt(values[10]) || 0,
          generation: parseInt(values[11]) || 1,
          legendary: values[12]?.toLowerCase() === 'true',
          image: values[13]?.replace(/"/g, '') || null,
          ytbUrl: values[14]?.replace(/"/g, '') || null,
        };

        await this.prisma.pokemon.upsert({
          where: { id: pokemonData.id },
          update: pokemonData,
          create: pokemonData,
        });
        
        importedCount++;
      } catch (error) {
        console.error(`Error importing Pokemon at line ${i + 1}:`, error);
      }
    }
    
    return {
      imported: importedCount,
      message: `Successfully imported ${importedCount} Pokemon`
    };
  }
}
