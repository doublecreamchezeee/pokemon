import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthStateService) private authState: AuthStateService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authState.isAuthenticated$.pipe(
      map(isAuth => isAuth ? true : this.router.createUrlTree(['/login']))
    );
  }
}
