import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { ConversationRoutingModule } from './conversation-routing.module';
import { UpdateConversationButtonComponent } from './components/update-conversation-button/update-conversation-button.component';
import * as ConversationsMessages from '../redux/reducers/conversation.reducer';
import { ConversationChatComponent } from './components/conversation-chat/conversation-chat.component';
import { PersonNamePipe } from '../group/pipes/person-name.pipe';
import { DeleteConversationButtonComponent } from './components/delete-conversation-button/delete-conversation-button.component';

@NgModule({
  declarations: [
    ConversationComponent,
    UpdateConversationButtonComponent,
    ConversationChatComponent,
    DeleteConversationButtonComponent,
  ],
  imports: [
    CommonModule,
    ConversationRoutingModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    StoreModule.forFeature(
      ConversationsMessages.conversationFeatureKey,
      ConversationsMessages.reducer,
    ),
    PersonNamePipe,
  ],
})
export class ConversationModule {}
