import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatAppRoutingModule } from './chat-app-routing.module';

import { AuthGuard } from './auth-guard.service';
import { AppsyncService } from './appsync.service';

import { ChatComponent } from './chat/chat.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatConvoListComponent } from './chat-convo-list/chat-convo-list.component';
import { ChatMessageViewComponent } from './chat-message-view/chat-message-view.component';

import { InfscrollDirective } from './infscroll.directive';
import { MomentAgoPipe } from './moment-ago.pipe';

import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChatAppRoutingModule,
    NgxPageScrollModule,
    NgbModule
  ],
  declarations: [
    ChatComponent,
    ChatMessageComponent,
    ChatInputComponent,
    ChatUserListComponent,
    ChatConvoListComponent,
    ChatMessageViewComponent,
    MomentAgoPipe,
    InfscrollDirective
  ]
})
export class ChatAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChatAppModule,
      providers: [
        AuthGuard,
        AppsyncService
      ]
    };
  }
}
