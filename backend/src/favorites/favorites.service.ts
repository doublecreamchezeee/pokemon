import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Adds a pokemon to user's favorites.
   * Implementation choice: Returns 409 on duplicate to clearly indicate the conflict.
   */
  async addFavorite(userId: number, pokemonId: number) {
    try {
      const favorite = await this.prisma.favorite.create({
        data: {
          userId,
          pokemonId,
        },
        include: {
          pokemon: true,
        },
      });
      return favorite;
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        throw new ConflictException('Pokemon is already in favorites');
      }
      throw error;
    }
  }

  /**
   * Removes a pokemon from user's favorites.
   * Implementation choice: Returns 404 when favorite doesn't exist to be explicit about the resource state.
   */
  async removeFavorite(userId: number, pokemonId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        pokemonId,
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });
  }

  /**
   * Gets all favorites for a user with full pokemon details.
   * Includes authorization check for admin vs regular user.
   */
  async getUserFavorites(requestingUserId: number, targetUserId: number, isAdmin: boolean) {
    // If not admin and trying to view other's favorites, throw error
    if (!isAdmin && requestingUserId !== targetUserId) {
      throw new NotFoundException('User not found');
    }

    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId: targetUserId,
      },
      include: {
        pokemon: {
          select: {
            id: true,
            name: true,
            type1: true,
            type2: true,
            total: true,
            hp: true,
            attack: true,
            defense: true,
            spAttack: true,
            spDefense: true,
            speed: true,
            generation: true,
            legendary: true,
            image: true,
            ytbUrl: true,
          },
        },
      },
    });

    return {
      items: favorites.map(fav => ({
        id: fav.pokemon.id,
        name: fav.pokemon.name,
        type1: fav.pokemon.type1,
        type2: fav.pokemon.type2,
        total: fav.pokemon.total,
        hp: fav.pokemon.hp,
        attack: fav.pokemon.attack,
        defense: fav.pokemon.defense,
        spAtk: fav.pokemon.spAttack,
        spDef: fav.pokemon.spDefense,
        speed: fav.pokemon.speed,
        generation: fav.pokemon.generation,
        legendary: fav.pokemon.legendary,
        image: fav.pokemon.image || `assets/images/pokemon/${fav.pokemon.id}.png`,
        ytUrl: fav.pokemon.ytbUrl || undefined,
      })),
      total: favorites.length,
    };
  }
}
