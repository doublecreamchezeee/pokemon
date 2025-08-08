import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthStateService, AuthUser } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authState: AuthStateService
  ) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        // Simulate user object, adapt as needed
        const user: AuthUser = { username: credentials.username };
        this.authState.login(user, res.token);
        this.router.navigate(['/']);
      }),
      catchError(err => {
        this.snackBar.open(err.error?.message || 'Login failed', 'Close', { duration: 3000 });
        return throwError(() => err);
      })
    );
  }

  signup(data: { username: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/signup`, data).pipe(
      tap(res => {
        const user: AuthUser = { username: data.username };
        this.authState.login(user, res.token);
        this.router.navigate(['/']);
      }),
      catchError(err => {
        this.snackBar.open(err.error?.message || 'Signup failed', 'Close', { duration: 3000 });
        return throwError(() => err);
      })
    );
  }

  logout() {
    this.authState.logout();
    this.router.navigate(['/login']);
  }
}
