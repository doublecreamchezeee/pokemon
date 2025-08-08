import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStateService } from '../services/auth-state.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authState: AuthStateService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Do not attach token to /auth/* endpoints
    if (req.url.includes('/auth/')) {
      return next.handle(req);
    }
    const token = this.authState.token;
    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
