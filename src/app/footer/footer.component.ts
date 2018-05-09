import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
  <nav class="navbar fixed-bottom navbar-light bg-light">
    <div class="container">
      <span class="text-muted mx-auto">
          Powered by <img class="awslogo mx-1" width='35px' src="../assets/img/AWS_logo_RGB.png">AppSync
      </span>
    </div>
  </nav>
  `
})
export class FooterComponent { }
