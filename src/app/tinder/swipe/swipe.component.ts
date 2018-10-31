import { Component, OnInit, OnDestroy } from '@angular/core';
import { TinderService } from '../tinder.service';
import { AccountService } from '../../account.service';
import { Observable } from 'rxjs';
import { TinderPerson, TinderProfile } from '../../Classes';
import { isNullOrUndefined, isNull } from 'util';

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

  constructor(private _accService:AccountService, private _tinderService: TinderService) { }

  ngOnInit() {
    console.log("called?");
    this._accService.authStateObservable().subscribe(waiter => {
      console.log("intra aici");
      this._subscribtionUserData = this._accService.userDataObservable().subscribe(waiter2 => {
        console.log("si aici intra ma")
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
