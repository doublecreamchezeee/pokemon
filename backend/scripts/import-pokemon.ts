import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

interface PokemonData {
  id: number;
  name: string;
  type1: string;
  type2: string;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  image: string;
  ytbUrl: string;
}

async function importPokemon() {
  const csvFilePath = path.resolve(__dirname, '../pokemon_data.csv');
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  const records: PokemonData[] = [];

  const parser = parse(fileContent, {
    delimiter: ',',
    columns: true,
    trim: true,
    skip_empty_lines: true,
    relax_quotes: true,
    bom: true,
    cast: (value, context) => {
      // Convert specific columns to their proper types
      if (context.column === 'id' || 
          context.column === 'total' || 
          context.column === 'hp' || 
          context.column === 'attack' || 
          context.column === 'defense' || 
          context.column === 'spAttack' || 
          context.column === 'spDefense' || 
          context.column === 'speed' || 
          context.column === 'generation') {
        return parseInt(value);
      }
      if (context.column === 'legendary') {
        return value.toLowerCase() === 'true';
      }
      return value;
    },
  });

  for await (const record of parser) {
    records.push({
      ...record,
      id: parseInt(record.id),
    } as PokemonData);
  }

  console.log(`Found ${records.length} Pokemon to import`);

  try {
    // Clear existing data
    await prisma.pokemon.deleteMany();

    // Import in batches of 100
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await prisma.pokemon.createMany({
        data: batch.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          type1: pokemon.type1,
          type2: pokemon.type2 || null,
          total: pokemon.total,
          hp: pokemon.hp,
          attack: pokemon.attack,
          defense: pokemon.defense,
          spAttack: pokemon.spAttack,
          spDefense: pokemon.spDefense,
          speed: pokemon.speed,
          generation: pokemon.generation,
          legendary: pokemon.legendary,
          image: pokemon.image,
          ytbUrl: pokemon.ytbUrl
        }))
      });
      console.log(`Imported batch ${i / batchSize + 1}`);
    }

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importPokemon().catch(console.error);
