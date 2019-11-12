import { Component, OnInit } from '@angular/core';
import { TinderService } from '../tinder.service';
import { TinderPerson, Conversation } from '../../Classes';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {
  public matches: TinderPerson[] = [];
  private _initialMatches: TinderPerson[];
  public conversations: Conversation[] = [];

  constructor(
    private _tinderService: TinderService,
    private _accService: AccountService
  ) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(() => {
      this._accService.userDataObservable().subscribe(() => {
        this._tinderService
          .loadMatches()
          .subscribe(persons => {
            this._initialMatches = persons;
          }, error => {
            console.log(error);
          });

        this._tinderService
          .getConversations()
          .subscribe(conversations => {
            if (this._initialMatches) {
              this.matches = this._initialMatches.filter(match => conversations.every(conversation => conversation.otherPersonId !== match.id));
            } else {
              this.matches = this._initialMatches;
            }
            
            this.conversations = conversations;   
          }, error => {
            console.log(error);
          });
      }); 
    });
  }
}
