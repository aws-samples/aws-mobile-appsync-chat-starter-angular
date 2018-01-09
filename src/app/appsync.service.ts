import { Injectable } from '@angular/core';
import AWSAppSyncClient from 'aws-appsync';
import appSyncConfig from '../AppSync';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { CONFIG } from './config';

@Injectable()
export class AppsyncService {

  client: AWSAppSyncClient;

  constructor(private jwtToken: string) {
    this.initClient();
  }

  initClient() {
    if (!this.jwtToken) { return; }
    console.log('AppSync Service Init', this.jwtToken);
    this.client = new AWSAppSyncClient({
      url: appSyncConfig.graphqlEndpoint,
      region: appSyncConfig.region,
      auth: {
        type: appSyncConfig.authenticationType,
        jwtToken: this.jwtToken
      }
    });
  }
}
