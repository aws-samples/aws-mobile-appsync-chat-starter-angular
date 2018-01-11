import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { SignoutComponent } from '../signout/signout.component';
import { ConfirmComponent } from '../confirm/confirm.component';


const authRoutes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component:  SignupComponent },
  { path: 'signout', component: SignoutComponent },
  { path: 'confirm', component: ConfirmComponent }
];

@NgModule({
  imports: [ RouterModule.forChild(authRoutes) ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule { }
