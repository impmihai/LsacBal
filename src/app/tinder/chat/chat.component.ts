import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, TinderProfile } from '../../Classes';
import { AccountService } from '../../account.service';
import { TinderService } from '../tinder.service';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  _messages: Message[];
  _otherPerson: TinderProfile;
  _otherPersonId: string;
  _msgVal: string;
  constructor(private _accService: AccountService, private _tinderService: TinderService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(waiter => {
      this._accService.userDataObservable().subscribe(waiter2 => {
        this._route.params.subscribe(params => {
          this._otherPersonId = params.id;
          this._tinderService
            .loadProfile(this._otherPersonId)
            .subscribe(profile => {
              this._otherPerson = profile;
            });
          this._tinderService
            .getMessages(params.id)
            .subscribe(messages => {
              this._messages = messages;
              this.scrollToBottom();
          });
        });
      });
    });
  }

  scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  chatSend(data) {
    if (data !== '') {
      console.log(data);
      this._msgVal = '';
      this._tinderService.sendMessage(this._otherPersonId, data);
    }
  }

  bothSentMessages(): boolean {
    if (this._messages && this._messages.length > 0 &&
      this._messages.filter(m => m.sender === this._otherPersonId).length > 0 &&
      this._messages.filter(m => m.sender === this._accService.userData.id).length > 0) {
      return true;
    }
    return false;
  }

  private picture(typ) {
    if (typ) {
      return this._accService.userData.displayImages[0];
    } else {
      return this._otherPerson.displayImages[0];
    }
  }

}
