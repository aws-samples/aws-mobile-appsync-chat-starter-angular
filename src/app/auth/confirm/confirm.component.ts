import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  errorMessage: string;
  @Input() model: any = {username: null, code: null};
  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.authService.confirm(this.model.username, this.model.code)
    .then(data => this.router.navigate(['/chat']))
    .catch(err => this.errorMessage = err.message);
  }
}
