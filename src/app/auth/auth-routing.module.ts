import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { STEP } from './auth-helper';
import { OnboardComponent } from './onboard/onboard.component';

const routes: Routes = [
  {path: 'signin', component: OnboardComponent, data: {'step': STEP['SIGNIN']}},
  {path: 'signup', component: OnboardComponent, data: {'step': STEP['SIGNUP']}},
  {path: 'confirm', component: OnboardComponent, data: {'step': STEP['CONFIRM']}},
  {path: 'signout', component: OnboardComponent, data: {'step': STEP['SIGNOUT']}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
