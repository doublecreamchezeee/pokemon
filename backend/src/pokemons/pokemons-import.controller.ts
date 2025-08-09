import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PokemonsService } from './pokemons.service';

@Controller('pokemons')
@UseGuards(JwtAuthGuard)
export class PokemonsImportController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importPokemons(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    try {
      return await this.pokemonsService.importFromCsv(file.buffer);
    } catch (error) {
      throw new BadRequestException('Failed to import CSV: ' + error.message);
    }
  }
}
