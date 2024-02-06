import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupComponent } from './pages/group/group.component';
import { GroupRoutingModule } from './group-routing.module';
import { GroupChatComponent } from './components/group-chat/group-chat.component';
import { UpdateChatButtonComponent } from './components/update-chat-button/update-chat-button.component';
import * as GroupsMessages from '../redux/reducers/group-dialog.reducer';
import { DeleteGroupButtonComponent } from './components/delete-group-button/delete-group-button.component';
import { PersonNamePipe } from './pipes/person-name.pipe';

@NgModule({
  declarations: [
    GroupComponent,
    GroupChatComponent,
    UpdateChatButtonComponent,
    DeleteGroupButtonComponent,
  ],
  imports: [
    CommonModule,
    GroupRoutingModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(
      GroupsMessages.groupsDialogFeatureKey,
      GroupsMessages.reducer,
    ),
    PersonNamePipe,
  ],
})
export class GroupModule {}
