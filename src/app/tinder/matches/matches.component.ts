import { Component, OnInit } from '@angular/core';
import { TinderService } from '../tinder.service';
import { TinderPerson } from '../../Classes';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  private _matches: TinderPerson[];

  constructor(private _tinderService: TinderService, private _accService: AccountService) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(waiter => {
      this._accService.userDataObservable().subscribe(waiter2 => {
        this._tinderService
            .loadMatches()
            .subscribe(persons => {
              this._matches = persons;
            });
      });
    }); 
  }
}
