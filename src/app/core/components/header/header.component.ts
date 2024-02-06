import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() isDarkTheme!: boolean | null;

  @Output() changeIsDarkTheme = new EventEmitter<boolean>();

  isAuthUser$ = this.authService.isLoggedIn$;

  constructor(public authService: AuthService) {}

  changeTheme() {
    const newTheme = this.isDarkTheme ? 'light-theme' : 'dark-theme';
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', newTheme);
    this.changeIsDarkTheme.emit(this.isDarkTheme);
  }
}
