import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isDarkTheme: null | boolean = false;

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.isDarkTheme = theme === 'dark-theme';
    } else {
      localStorage.setItem('theme', 'light-theme');
    }
  }

  onIsDarkThemeChange(isDarkTheme: boolean) {
    this.isDarkTheme = isDarkTheme;
  }
}
