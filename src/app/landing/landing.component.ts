import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { MessagingService } from '../messaging.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private accService: AccountService, private router: Router, private _messagingService: MessagingService) { }

  ngOnInit() {
    this._messagingService.receiveMessage();
    this._messagingService.currentMessage.subscribe(tst => {
      console.log(tst);
    });
  }

  login() {
    this.accService.doFacebookLogin();
    
    this.accService.authStateObservable().subscribe(e => {
      
          this.router.navigate(['/swipe']);
    });

  }

  logout() {
    console.log("asd22");
    this.accService.doLogout();
  }
}
