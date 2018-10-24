import { Component, OnInit } from '@angular/core';
import { TinderService } from '../tinder.service';
import { AccountService } from '../../account.service';
import { Observable } from 'rxjs';
import { TinderPerson, TinderProfile } from '../../Classes';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.css']
})
export class SwipeComponent implements OnInit {
  private _persons: TinderPerson[];
  private _profiles: { [id: string] : TinderProfile } = {};

  
  constructor(private _accService:AccountService, private _tinderService: TinderService) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(waiter => {
      this._accService.userDataObservable().subscribe(waiter2 => {
        this._tinderService
            .loadPersons()
            .subscribe(persons => {
              this._persons = persons;
              this._persons.forEach(person => {
                person.profile.subscribe(profile => {
                  if (isNullOrUndefined(this._profiles[person.id])) {
                    this._profiles[person.id] = profile;
                  }
                });
              });
            });
      });
    });
  }

  likePerson(event) {
    console.log(event);
    this._tinderService.likePerson(event);
  }
}
