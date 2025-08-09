import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PokemonsModule } from './pokemons/pokemons.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [PrismaModule, AuthModule, PokemonsModule, FavoritesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
