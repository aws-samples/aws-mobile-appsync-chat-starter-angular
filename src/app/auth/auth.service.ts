import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {

  isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor() {
    Auth.currentSession()
    .then(session => this.isLoggedIn.next(true))
    .catch(() => this.isLoggedIn.next(false));
  }

  signin(username, password): Promise<any> {
    return Auth.signIn(username, password).then(user => {
      this.isLoggedIn.next(true);
      return user;
    });
  }

  signout(): Promise<any> {
    return Auth.signOut().then(data => {
      this.isLoggedIn.next(false);
      return data;
    });
  }

  signup(username, password, email): Promise<any> {
    return Auth.signUp(username, password, email);
  }

  confirm(username, code): Promise<any> {
    return Auth.confirmSignUp(username, code);
  }
}
