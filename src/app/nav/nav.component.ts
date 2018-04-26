import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {
  isLoggedIn = false;

  constructor(private amplifyService: AmplifyService, public router: Router) {
    this.amplifyService.authStateChange$.subscribe(authState => {
      const isLoggedIn = authState.state === 'signedIn' || authState.state === 'confirmSignIn';
      if (this.isLoggedIn && !isLoggedIn) {
        router.navigate(['']);
      } else if (!this.isLoggedIn && isLoggedIn) {
        router.navigate(['/chat']);
      }
      this.isLoggedIn = isLoggedIn;
    });
  }

  public signOut() {
    this.amplifyService.auth().signOut();
  }
}
