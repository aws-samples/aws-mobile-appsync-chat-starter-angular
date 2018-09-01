import { Injectable } from '@angular/core';
import AWSAppSyncClient from 'aws-appsync';
import appSyncConfig from '../../AppSync.js';
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link';
import { Auth } from 'aws-amplify';

@Injectable()
export class AppsyncService {
  private client: AWSAppSyncClient<any> = new AWSAppSyncClient({
    url: appSyncConfig.graphqlEndpoint,
    region: appSyncConfig.region,
    auth: {
      type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
      jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
    }
  });

  hc = () => this.client.hydrated();
}
