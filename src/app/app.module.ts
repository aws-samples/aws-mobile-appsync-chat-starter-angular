import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { RoutingModule } from './routing.module';
import { AuthService } from './auth.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { OrderModule } from 'ngx-order-pipe';
import {NgxPageScrollModule} from 'ngx-page-scroll';
// import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';

// import { ApolloModule } from 'apollo-angular';
// import { HttpLinkModule } from 'apollo-angular-link-http';

import { MomentAgoPipe } from './moment-ago.pipe';
import { AuthGuard } from './auth-guard.service';
import { appsyncServiceProvider } from './appsync.service.provider';

import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatConvoListComponent } from './chat-convo-list/chat-convo-list.component';
import { ChatMessageViewComponent } from './chat-message-view/chat-message-view.component';

import { InfscrollDirective } from './infscroll.directive';

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
    InfscrollDirective
  ],
  imports: [

    // HttpClientModule, // provides HttpClient for HttpLink
    // ApolloModule,
    // HttpLinkModule,
    OrderModule,
    NgxPageScrollModule,
    BrowserModule,
    RoutingModule,
    FormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    appsyncServiceProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
