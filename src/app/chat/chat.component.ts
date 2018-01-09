import { Component, OnInit  } from '@angular/core';
import { AuthService } from '../auth.service';
import { CONFIG } from '../config';
import { SwUpdate } from '@angular/service-worker';
import {PageScrollConfig} from 'ngx-page-scroll';

import AWSAppSyncClient from 'aws-appsync';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';

import User from '../types/user';
import Conversation from '../types/conversation';

import { AppsyncService } from '../appsync.service';
import createUser from '../graphql/mutations/createUser';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  username: string;
  client: AWSAppSyncClient;
  me: User;
  conversation: Conversation;
  update: boolean;

  constructor(
    private authService: AuthService,
    private swUpdate: SwUpdate,
    private appsync: AppsyncService
  ) {
    PageScrollConfig.defaultDuration = 400;
  }

  ngOnInit() {
    this.authService.parse();
    this.authService.getSession();

    const token = this.authService.session.idToken.jwtToken;
    const parsed_token = this.parseJwt(token);
    this.username = parsed_token['cognito:username'];

    this.logInfoToConsole(token);

    this.register();

    this.appsync.initClient();

    this.swUpdate.available.subscribe(event => {
      console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
      this.update = true;
    });
  }

  logInfoToConsole(token) {
    console.log(`ID Token: <${token}>`);
    console.log('Decoded ID Token:');
    console.log(JSON.stringify(this.parseJwt(token), null, 2));
    console.log('Signed In: ' +  this.authService.isLoggedIn);
  }

  register() {
    this.appsync.client.hydrated().then(client => {
      client.mutate({
        mutation: createUser,
        variables: { 'username': this.username }
      })
      .then(({data}) => {
        if (data) {
          this.me = data.createUser;
          console.log('successfully registered self', this.me);
        } else {
          console.log('Trying to register. did not get data');
        }
      }).catch(error => console.log('Error trying to register', error));
    });
  }

  setNewConvo(convo) { this.conversation = convo; }

  parseJwt(token) {
    const payload = token.split('.')[1];
    const parser = JSON.parse(atob(payload));
    return parser;
  }

  checkForUpdate() {
    console.log('[ChatQL] checkForUpdate started');
    this.swUpdate.checkForUpdate()
    .then(() => { console.log('[ChatQL] checkForUpdate completed'); })
    .catch(err => { console.error(err); });
  }

  activateUpdate() {
    console.log('[ChatQL] activateUpdate started');
    this.swUpdate.activateUpdate()
    .then(() => {
      console.log('[ChatQL] activateUpdate completed');
      location.reload();
    }).catch(err => { console.error(err); });
    this.update = false;
  }
}
