import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {


  errorMessage;
  @Input() model: any = {username: null, password: null};
  constructor(
    private router: Router,
    private authService: AuthService) {}

  onSubmit() {
    this.authService.signin(this.model.username, this.model.password)
    .then(user => this.router.navigate(['/chat']))
    .catch(err => this.errorMessage = err.message);
  }

}
