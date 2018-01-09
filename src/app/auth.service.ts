import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CONFIG } from './config';
declare let AWSCognito: any;

@Injectable()
export class AuthService {

  _auth: any;
  session = null;
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor() {
    const config = CONFIG;
    const authData = {
      ClientId : config.COGNITO_APP_ID,
      AppWebDomain : config.COGNITO_DOMAIN,
      TokenScopesArray : ['openid'],
      RedirectUriSignIn : config.CLOUDFRONT_WEBSITE + '/chat',
      RedirectUriSignOut : config.CLOUDFRONT_WEBSITE
    };
    this._auth = new AWSCognito.CognitoIdentityServiceProvider.CognitoAuth(authData);
    this._auth.userhandler = {
      onSuccess: (session) => {
        this.loggedIn.next(true);
        this.session = session;
        console.log('Successful log in:', session);
      },
      onFailure: (err) => { console.log('Error!' + err); }
    };
  }

  get jwtToken(): string { return this.session ? this.session.idToken.jwtToken : null; }

  isLoggedIn(): boolean { return this.session && this.session.isValid(); }

  signin(): void { this._auth.getSession(); }

  signout(): void { this._auth.signOut(); }

  parse(): void { this._auth.parseCognitoWebResponse(window.location.href); }

  getSession() { return this._auth.getSession(); }

  checkIsLoggedIn(): boolean {
    let session = this._auth.signInUserSession;
    const tokenScopesInputSet = new Set(this._auth.TokenScopesArray);
    const cachedScopesSet = new Set(session.tokenScopes.getScopes());
    if (session != null && session.isValid()) {
        this.loggedIn.next(true);
        return true;
    }
    session = this._auth.getCachedSession();

    if (!this._auth.compareSets(tokenScopesInputSet, cachedScopesSet)) {
      this.loggedIn.next(false);
      return false;
    } else if (session.isValid()) {
      this.loggedIn.next(true);
      return true;
    } else {
      this.loggedIn.next(false);
      return false;
    }
  }
}
