import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Auth } from 'aws-amplify';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    console.log('AuthGuard#canActivate called');
    return Auth.currentSession()
    .then(data => true)
    .catch(err => {
      console.log('AuthGuard: ', err);
      this.router.navigate(['/signin']);
      return false;
    });
  }
}
