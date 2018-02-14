import { InjectionToken } from '@angular/core';
import { Auth } from 'aws-amplify';

const AuthHelper = {
  signin({username, password}): Promise<any> {
    return Auth.signOut().then(
      () =>  Auth.signIn(username, password),
      () =>  Auth.signIn(username, password)
    );
  },

  signout(): Promise<any> { return Auth.signOut(); },

  signup({username, password, email}): Promise<any> {
    return Auth.signUp(username, password, email);
  },

  confirm({username, code}): Promise<any> {
    return Auth.confirmSignUp(username, code);
  }
};
export default AuthHelper;

export const SIGNIN_PATH = new InjectionToken<string>('SIGNIN_PATH');

export const STEP = {
  SIGNIN: {KEY: 'signin', TITLE: 'Sign In'},
  SIGNUP: {KEY: 'signup', TITLE: 'Sign Up'},
  CONFIRM: {KEY: 'confirm', TITLE: 'Confirm Account'},
  SIGNOUT: {KEY: 'signout', TITLE: null}
};
