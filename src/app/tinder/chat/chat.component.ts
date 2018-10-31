import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, TinderProfile } from '../../Classes';
import { AccountService } from '../../account.service';
import { TinderService } from '../tinder.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private _messages: Message[];
  private _otherPerson: TinderProfile;
  private _otherPersonId: string;
  private _msgVal: string;
  constructor(private _accService: AccountService, private _tinderService: TinderService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(waiter => {
      this._accService.userDataObservable().subscribe(waiter2 => {
        this._route.params.subscribe(params => {
          this._otherPersonId = params.id;
          this._tinderService
          .getMessages(params.id)
          .subscribe(messages => {
            this._messages = messages;
            console.log(this._messages);
          });
        });
      });
    }); 
  }

  private chatSend(data) {
    if (data !== "") {
      console.log(data);
      this._msgVal = "";
      this._tinderService.sendMessage(this._otherPersonId, data);
    }
  }

}
