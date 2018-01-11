import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  errorMessage: string;
  @Input() model: any = {username: null, password: null, email: null};
  constructor(private router: Router, private authService: AuthService) { }

  onSubmit() {
    this.authService.signup(this.model.username, this.model.password, this.model.email)
    .then(user => {
      console.log(user);
      this.router.navigate(['/confirm']);
    })
    .catch(err => this.errorMessage = err.message);
  }
}
