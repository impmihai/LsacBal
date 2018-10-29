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

  
  constructor(private _accService:AccountService, private _tinderService: TinderService) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(waiter => {
      this._accService.userDataObservable().subscribe(waiter2 => {
        this._tinderService
            .loadPersons()
            .subscribe(persons => {
              this._persons = persons;
            });
      });
    });
  }

  likePerson(event) {
    console.log(event);
    this._tinderService.likePerson(event);
  }
}
