
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PokemonsComponent } from './pokemons/pokemons.component';
import { AuthGuard } from './auth/auth.guard';
import { FavoritesComponent } from './favorites/favorites.component';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'pokemons', component: PokemonsComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] }
];
