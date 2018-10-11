import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private accService: AccountService) { }

  ngOnInit() {

  }

  login() {
    this.accService.doFacebookLogin();
  }

  logout() {
    this.accService.doLogout();
  }

  update() {
    this.accService.updateData({cevanou22: 2});
  }
}
