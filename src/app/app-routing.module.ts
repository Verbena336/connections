import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { loginGuard } from './auth/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./connections/connections.module').then(
        (m) => m.ConnectionsModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./auth/signin.module').then((m) => m.SignInModule),
    canActivate: [loginGuard],
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./auth/signup.module').then((m) => m.SignUpModule),
    canActivate: [loginGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
    canActivate: [authGuard],
  },
  {
    path: 'group/:id',
    loadChildren: () =>
      import('./group/group.module').then((m) => m.GroupModule),
    canActivate: [authGuard],
  },
  {
    path: 'conversation/:id',
    loadChildren: () =>
      import('./conversation/conversation.module').then(
        (m) => m.ConversationModule,
      ),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadChildren: () =>
      import('./404/not-found.module').then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
