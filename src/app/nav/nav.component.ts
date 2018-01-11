import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Auth } from 'aws-amplify';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isLoggedIn = false;
  constructor(private authService: AuthService) {
    this.authService.isLoggedIn.subscribe(status => this.isLoggedIn = status);
    Auth.currentSession().then(session => this.isLoggedIn = true)
    .catch(err => console.log(err));
  }
}
