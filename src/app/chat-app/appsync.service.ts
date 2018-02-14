import { Injectable } from '@angular/core';
import AWSAppSyncClient from 'aws-appsync';
import appSyncConfig from '../../AppSync.js';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { Auth } from 'aws-amplify';

@Injectable()
export class AppsyncService {

  _client: AWSAppSyncClient;
  hc;

  constructor() {
    this.hc = this.hydratedClient;
  }

  hydratedClient() {
    return Auth.currentSession().then(session => {
      return new Promise((resolve, reject) => {
        if (session) {
          this._client = this._client || this.newClient(session);
          resolve(this._client.hydrated());
        } else {
          reject('No session');
        }
      });
    });
  }

  private newClient(session) {
    return new AWSAppSyncClient({
      url: appSyncConfig.graphqlEndpoint,
      region: appSyncConfig.region,
      auth: {
        type: appSyncConfig.authenticationType,
        jwtToken: session.idToken.jwtToken
      }
    });
  }
}
