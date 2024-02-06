import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-menu-navigation',
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.scss'],
})
export class MenuNavigationComponent {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  isAuthUser$ = this.authService.isLoggedIn$;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  handleProfile() {
    this.router.navigate(['/profile']);
  }

  handleMain() {
    this.router.navigate(['']);
  }
}
