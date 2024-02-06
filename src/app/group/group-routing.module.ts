import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupComponent } from './pages/group/group.component';

const routes = [{ path: '', component: GroupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule {}
