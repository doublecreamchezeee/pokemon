import { Component, Output, EventEmitter } from '@angular/core';
import { AuthStateService } from '../../services/auth-state.service';
import { Observable } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isAuthenticated$: Observable<boolean>;
  sidenavOpened = false;

  constructor(private authState: AuthStateService) {
    this.isAuthenticated$ = this.authState.isAuthenticated$;
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout() {
    this.authState.logout();
  }
}
