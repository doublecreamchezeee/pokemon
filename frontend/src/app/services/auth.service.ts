import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthStateService, AuthUser } from './auth-state.service';
import { environment } from '../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private authState: AuthStateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Try to restore session from localStorage only in browser
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          this.authState.login(user, token);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    }
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.authState.login(res.user, res.accessToken);
        if (this.isBrowser) {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.router.navigate(['/pokemons']);
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
      }),
      catchError(err => {
        const message = err.error?.message || 'Login failed. Please check your credentials.';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        return throwError(() => err);
      })
    );
  }

  signup(data: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/signup`, data).pipe(
      tap(res => {
        this.authState.login(res.user, res.accessToken);
        if (this.isBrowser) {
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        this.router.navigate(['/pokemons']);
        this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
      }),
      catchError(err => {
        const message = err.error?.message || 'Registration failed. Please try again.';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        return throwError(() => err);
      })
    );
  }

  logout() {
    this.authState.logout();
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
    this.snackBar.open('You have been logged out', 'Close', { duration: 3000 });
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/me`).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.logout();
        }
        return throwError(() => err);
      })
    );
  }
}
