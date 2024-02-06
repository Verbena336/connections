import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SignInRoutingModule } from './auth/signin-routing.module';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { UserProfileEffects } from './redux/effects/user-profile.effect';
import { ProfileRoutingModule } from './profile/profile-routing.module';
import { ConnectionsRoutingModule } from './connections/connections-routing.module';
import { SignUpRoutingModule } from './auth/signup-routing.module';
import { GroupRoutingModule } from './group/group-routing.module';
import { GroupsDialogEffects } from './redux/effects/group-dialog.effect';
import { ConversationRoutingModule } from './conversation/conversation-routing.module';
import { ConversationEffects } from './redux/effects/conversation.effect';
import { NotFoundRoutingModule } from './404/not-found-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([
      UserProfileEffects,
      GroupsDialogEffects,
      ConversationEffects,
    ]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    CoreModule,
    SignInRoutingModule,
    SignUpRoutingModule,
    ProfileRoutingModule,
    ConnectionsRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    GroupRoutingModule,
    NotFoundRoutingModule,
    ConversationRoutingModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['toast'],
      },
    },
  ],
})
export class AppModule {}
