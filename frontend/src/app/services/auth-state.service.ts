import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthUser {
  username: string;
  // add more fields as needed
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();
  token$: Observable<string | null> = this.tokenSubject.asObservable();
  isAuthenticated$: Observable<boolean> = this.tokenSubject.asObservable().pipe(
    map(token => !!token)
  );

  login(user: AuthUser, token: string) {
    this.currentUserSubject.next(user);
    this.tokenSubject.next(token);
  }

  logout() {
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }
}
