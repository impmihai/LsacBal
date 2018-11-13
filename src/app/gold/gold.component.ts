import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';
import { Message, MessageType, TinderProfile, AccountInfo } from '../Classes';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-gold',
  templateUrl: './gold.component.html',
  styleUrls: ['./gold.component.css']
})
export class GoldComponent implements OnInit {
  _messagesObservable: any;
  private expectedPass: String = "Cele10Porunci";
  private expectedFavP: String = "Mario";
  public name: String;
  public pass: String;
  public favP: String;
  public mesaje;

  constructor(private _afFirestore: AngularFirestore, private _accService: AccountService, private router: Router) { }
  private _users: TinderProfile[];
  ngOnInit() {
    // this._afFirestore.collection('tinder').doc('messages').get().subscribe(conversatii => {
    //   let id = conversatii.id.split('-')[0];
    //   this.getMessages(conversatii.data.)
    // })
    this._afFirestore.collection('users').snapshotChanges().pipe(
      map(users => {
        return users.map(user => user.payload.doc.data() as TinderProfile)
      })
    )
  }

  public getMessages(conversationKey: string) {
      let talker = conversationKey.split('-')[0];
      return this._afFirestore
                                              .collection('tinder')
                                              .doc('messages')
                                              .collection(conversationKey, ref => ref.orderBy('timestamp'))
                                              .valueChanges()
                                              .pipe(map(messages => {
                                                return messages.map(messageData => {
                                                  let message: Message = messageData as Message;
                                                  if (messageData.sender == talker) {
                                                    message.type = MessageType.SENT;
                                                  } else {
                                                    message.type = MessageType.RECEIVED;
                                                  }
                                                  return message;
                                                });
                                              }));
    }

  onSubmit() 
  { 
    if (this.pass === this.expectedPass
      && this.favP === this.expectedFavP) {
        this._accService.updateData({likesCount: 10000})
        alert("Congratz " + name + ", now you walk among the gods!");
    } else {
      alert("You, " + name + ", are not the chosen one!");
    }
    this.router.navigate(['/swipe']);
  }

}
