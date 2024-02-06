import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConversationComponent } from './pages/conversation/conversation.component';

const routes = [{ path: '', component: ConversationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversationRoutingModule {}
