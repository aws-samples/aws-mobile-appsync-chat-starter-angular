import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AuthRoutingModule } from './auth/auth-routing/auth-routing.module';
import { RoutingModule } from './routing.module';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignoutComponent } from './auth/signout/signout.component';
import { ConfirmComponent } from './auth/confirm/confirm.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { MomentAgoPipe } from './moment-ago.pipe';
import { AuthGuard } from './auth-guard.service';
import { appsyncServiceProvider } from './appsync.service.provider';
import { AuthService } from './auth/auth.service';
import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatConvoListComponent } from './chat-convo-list/chat-convo-list.component';
import { ChatMessageViewComponent } from './chat-message-view/chat-message-view.component';

import { InfscrollDirective } from './infscroll.directive';

import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports';
Amplify.configure(aws_exports);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    ChatComponent,
    MomentAgoPipe,
    ChatMessageComponent,
    ChatInputComponent,
    ChatUserListComponent,
    ChatConvoListComponent,
    ChatMessageViewComponent,
    SigninComponent,
    SignupComponent,
    SignoutComponent,
    ConfirmComponent,
    InfscrollDirective
  ],
  imports: [
    NgxPageScrollModule,
    BrowserModule,
    AuthRoutingModule,
    RoutingModule,
    FormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    NgbModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AuthService,
    appsyncServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
