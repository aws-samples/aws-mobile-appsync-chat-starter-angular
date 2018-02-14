import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { OnboardComponent } from './onboard/onboard.component';
import AuthHelper, { SIGNIN_PATH } from './auth-helper';


@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule
  ],
  declarations: [
    OnboardComponent
  ],
  exports: [
  ]
})
export class AuthModule {
  static forRoot(config = {signInPath: '/'}): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        {provide: SIGNIN_PATH, useValue: config.signInPath}
      ]
    };
  }
}
