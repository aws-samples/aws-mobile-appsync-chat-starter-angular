import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Auth } from 'aws-amplify';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isLoggedIn = false;
  constructor(private router: Router) {
    this.checkStatus();
    router.events
      .filter(e => e instanceof NavigationEnd)
      .subscribe(e => this.checkStatus());
  }

  private checkStatus() {
    Auth.currentSession()
    .then(session => this.isLoggedIn = true)
    .catch(err => this.isLoggedIn = false);  }
  }
