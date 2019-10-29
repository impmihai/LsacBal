import { Component, OnInit, OnDestroy } from '@angular/core';
import { TinderService } from '../tinder.service';
import { AccountService } from '../../account.service';
import { Observable } from 'rxjs';
import { TinderPerson, TinderProfile } from '../../Classes';
import { isNullOrUndefined, isNull } from 'util';
import { Router } from '@angular/router';
import { MessagingService } from 'src/app/messaging.service';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.css']
})
export class SwipeComponent implements OnInit, OnDestroy {

  _persons: TinderPerson[];
  _firstPerson: TinderPerson;
  _subscribtionUserData = null;

  constructor(private _messagingService: MessagingService,
              private _accService: AccountService,
              private _tinderService: TinderService,
              private router: Router) { }


  ngOnDestroy(): void {
    if (!isNullOrUndefined(this._subscribtionUserData)) {
      this._subscribtionUserData.unsubscribe();
    }
  }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(waiter => {
      this._subscribtionUserData = this._accService.userDataObservable().subscribe(waiter2 => {
        if (isNullOrUndefined(this._accService.userData.raspuns)) {
          this.router.navigate(['/tinder']);
        }
        this._tinderService
            .loadPersons()
            .pipe()
            .subscribe(persons => {
              this._persons = persons;
              console.log(persons);
              if (!isNullOrUndefined(this._persons) && !isNullOrUndefined(this._persons[0])) {
                this._firstPerson = this._persons[0];
              } else {
                this._firstPerson = null;
              }
            });
      });
    });
  }

  likePerson(event) {
    console.log(event);
    this._tinderService.likePerson(event);
  }
}
