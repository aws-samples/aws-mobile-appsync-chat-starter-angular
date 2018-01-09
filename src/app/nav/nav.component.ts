import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/Observable';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isLoggedIn = false;
  constructor(private router: Router, private auth: AuthService) {
    this.auth.loggedIn.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        if (window.location.pathname !== '/chat') {
          this.router.navigate(['chat']);
        }
      }
    });
  }
}
