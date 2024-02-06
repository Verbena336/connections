import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ConnectionsRoutingModule } from './connections-routing.module';
import { GroupListComponent } from './components/group-list/group-list.component';
import { CreateGroupButtonComponent } from './components/create-group-button/create-group-button.component';
import { UpdateGroupsButtonComponent } from './components/update-groups-button/update-groups-button.component';
import { GroupSectionComponent } from './components/group-section/group-section.component';
import { PeopleSectionComponent } from './components/people-section/people-section.component';
import { PeopleListComponent } from './components/people-list/people-list.component';
import { UpdatePeopleButtonComponent } from './components/update-people-button/update-people-button.component';

@NgModule({
  declarations: [
    MainPageComponent,
    GroupListComponent,
    CreateGroupButtonComponent,
    UpdateGroupsButtonComponent,
    GroupSectionComponent,
    PeopleSectionComponent,
    PeopleListComponent,
    UpdatePeopleButtonComponent,
  ],
  imports: [
    CommonModule,
    ConnectionsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class ConnectionsModule {}
