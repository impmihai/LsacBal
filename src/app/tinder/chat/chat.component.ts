import { Component, OnInit } from '@angular/core';
import { Message, TinderProfile } from '../../Classes';
import { AccountService } from '../../account.service';
import { TinderService } from '../tinder.service';
import { ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public messages: Message[];
  public otherPerson: TinderProfile;
  private _otherPersonId: string;
  public msgVal: string;

  constructor(
    private _accService: AccountService,
    private _tinderService: TinderService,
    private _route: ActivatedRoute,
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer
  ) {
    _iconRegistry.addSvgIcon(
      'send',
      _sanitizer.bypassSecurityTrustResourceUrl('assets/images/send-24px.svg'));
  }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(() => {
      this._accService.userDataObservable().subscribe(() => {
        this._route.params.subscribe(params => {
          this._otherPersonId = params.id;
          this._tinderService
            .loadProfile(this._otherPersonId)
            .subscribe(profile => {
              this.otherPerson = profile;
            });

          this._tinderService
            .getMessages(params.id)
            .subscribe(response => {
              this.messages = response;
              this._scrollToBottom();
          });
        });
      });
    }); 
  }

  public chatSend() {
    if (this.msgVal !== "") {
      this._tinderService.sendMessage(this._otherPersonId, this.msgVal)
        .then(() => {
          this.msgVal = "";
        })
    }
  }

  private _scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  public getImage(typ) {
    if (typ) {
      return this._accService.userData.displayImages[0];
    } else {
      return this.otherPerson.displayImages[0]
    }
  }
}
