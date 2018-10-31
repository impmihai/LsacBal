import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private accService: AccountService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.accService.doFacebookLogin();
    this.accService.authStateObservable().subscribe(e => {
      this.accService.userDataObservable().subscribe(ceva =>
        {
          this.router.navigate(['/swipe']);
        })
    });

  }

  logout() {
    console.log("asd22");
    this.accService.doLogout();
  }
}
