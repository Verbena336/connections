import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './components/header/header.component';
import { MenuNavigationComponent } from './components/menu-navigation/menu-navigation.component';
import { CreateGroupModalComponent } from './components/create-group-modal/create-group-modal.component';
import { AppLoadingComponent } from './components/loading/loading.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MenuNavigationComponent,
    AppLoadingComponent,
    ConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatProgressBarModule,
    CreateGroupModalComponent,
    MatMenuModule,
    MatDialogModule,
  ],
  exports: [HeaderComponent, AppLoadingComponent],
})
export class CoreModule {}
