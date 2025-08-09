import { Controller, Post, Delete, Get, Param, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Pokemon } from '../pokemons/entities/pokemon.entity';

interface RequestWithUser extends Request {
  user: {
    id: number;
    username: string;
    isAdmin?: boolean;
  };
}

interface FavoritesResponse {
  items: Pokemon[];
  total: number;
}

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * Adds a pokemon to the authenticated user's favorites.
   * Returns 409 if the pokemon is already in favorites.
   */
  @Post(':pokemonId')
  async addFavorite(
    @Request() req: RequestWithUser,
    @Param('pokemonId', ParseIntPipe) pokemonId: number,
  ) {
    return this.favoritesService.addFavorite(req.user.id, pokemonId);
  }

  /**
   * Removes a pokemon from the authenticated user's favorites.
   * Returns 404 if the favorite doesn't exist.
   */
  @Delete(':pokemonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Request() req: RequestWithUser,
    @Param('pokemonId', ParseIntPipe) pokemonId: number,
  ) {
    await this.favoritesService.removeFavorite(req.user.id, pokemonId);
  }

  /**
   * Gets favorites for the currently authenticated user.
   */
  @Get('users/me')
  async getMyFavorites(
    @Request() req: RequestWithUser,
  ): Promise<FavoritesResponse> {
    return this.favoritesService.getUserFavorites(
      req.user.id,
      req.user.id,
      false,
    );
  }
  
  /**
   * Gets all favorites for a user.
   * Regular users can only view their own favorites.
   * Admins can view any user's favorites.
   */
  @Get('users/:userId')
  async getUserFavorites(
    @Request() req: RequestWithUser,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<FavoritesResponse> {
    return this.favoritesService.getUserFavorites(
      req.user.id,
      userId,
      req.user.isAdmin || false,
    );
  }

}
