import { Component, OnInit, OnDestroy } from '@angular/core';
import { TinderService } from '../tinder.service';
import { AccountService } from '../../account.service';
import { Observable } from 'rxjs';
import { TinderPerson, TinderProfile } from '../../Classes';
import { isNullOrUndefined, isNull } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.css']
})
export class SwipeComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (!isNullOrUndefined(this._subscribtionUserData))
      this._subscribtionUserData.unsubscribe();
  }
  private _persons: TinderPerson[];
  private _firstPerson: TinderPerson;
  
  private _subscribtionUserData = null;

  constructor(private _accService:AccountService, private _tinderService: TinderService, private router: Router) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(waiter => {
      this._subscribtionUserData = this._accService.userDataObservable().subscribe(waiter2 => {
        console.log("ajunge aici");
        if (isNullOrUndefined(this._accService.userData.raspuns)) {
          this.router.navigate(['/tinder']);
        }
        this._tinderService
            .loadPersons()
            .pipe()
            .subscribe(persons => {
              this._persons = persons;
              console.log(persons);
              if (!isNullOrUndefined(this._persons) && !isNullOrUndefined(this._persons[0]))
                this._firstPerson = this._persons[0];
              else
                this._firstPerson = null;
            });
      });
    });
  }

  likePerson(event) {
    console.log(event);
    this._tinderService.likePerson(event);
  }
}
