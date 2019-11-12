import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { MessagingService } from '../messaging.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  helpDisplayed: boolean = false;

  private _deadline = 'November 12 2019 20:00:00 GMT+0200';
  public countdown: string;
  public stopCountDown = false;
  constructor(private _afFirestore: AngularFirestore, private accService: AccountService, private router: Router, private _messagingService: MessagingService) { }

  ngOnInit() {
    this.initializeClock();
  }

  login() {
    this.accService.doFacebookLogin().then(result => this.helpDisplayed = true);
    this.accService.authStateObservable().subscribe(e => {
          this.router.navigate(['/vote']);
    });
  }

  logout() {
    this.accService.doLogout();
  }

  getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date().toString());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);

    return {
      'total': t,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }
  
  initializeClock() {
    const updateClock = () => {
      const t = this.getTimeRemaining(this._deadline);

      this.countdown = `${('0' + t.hours).slice(-2)}:${('0' + t.minutes).slice(-2)}:${('0' + t.seconds).slice(-2)}`
  
      if (t.total <= 0) {
        this.stopCountDown = true;
        clearInterval(timeinterval);
      }
    }
  
    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
  }
}
