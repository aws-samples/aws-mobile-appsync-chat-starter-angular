import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import AuthHelper, { SIGNIN_PATH, STEP } from '../auth-helper';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css']
})
export class OnboardComponent implements OnInit {

  step = STEP.SIGNIN;
  errorMessage;
  @Input() model: any = {};
  constructor(private router: Router, private route: ActivatedRoute, @Inject(SIGNIN_PATH) private signinPath: string) { }

  ngOnInit() {
    this.route.data.subscribe(({step}) => {
      this.step = step;
      console.log('step is', this.step);

      if (this.step.KEY === STEP.SIGNOUT.KEY) {
        AuthHelper.signout()
        .then(data => this.router.navigate(['']))
        .catch(err => console.log(err));
      }
    });
  }

  get showPassword() { return this.step.KEY === STEP.SIGNIN.KEY || this.step.KEY === STEP.SIGNUP.KEY; }
  get showEmail() { return this.step.KEY === STEP.SIGNUP.KEY; }
  get showCode() { return this.step.KEY === STEP.CONFIRM.KEY; }
  get nextStep() {
    let nextStep = null;
    if (this.step.KEY === STEP.SIGNIN.KEY) {
      nextStep = STEP.SIGNUP;
    } else if (this.step.KEY === STEP.SIGNUP.KEY) {
      nextStep = STEP.CONFIRM;
    }
    return nextStep;
  }

  onSubmit() {
    const to = this.step.KEY === STEP.SIGNUP.KEY ? ['/' + STEP.CONFIRM.KEY] : [this.signinPath];
    AuthHelper[this.step.KEY](this.model)
    .then(user => this.router.navigate(to))
    .catch(err => this.errorMessage = err.message);
  }
}
