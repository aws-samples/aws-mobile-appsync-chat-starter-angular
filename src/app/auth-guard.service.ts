import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate() {
    console.log('AuthGuard#canActivate called');
    this.auth.parse();
    if (this.auth.checkIsLoggedIn()) { return true; }
    this.router.navigate(['']);
    return false;
  }

}
