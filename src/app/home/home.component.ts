import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticatorComponent } from 'aws-amplify-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit() {}

}
