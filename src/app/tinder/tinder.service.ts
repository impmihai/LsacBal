import { Injectable } from '@angular/core';
import { AccountInfo, Message, MessageType, TinderProfile, TinderPerson, Conversation } from 'src/app/Classes';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AccountService } from '../account.service';
import { isNullOrUndefined, isNull } from 'util';
import { map } from 'rxjs/internal/operators/map';
import * as firebase from 'firebase';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class TinderService {
  private _personsObservable: Observable<TinderPerson[]>;
  private _personsSubject: Subject<TinderPerson[]>;

  private _matchesObservable: Observable<TinderPerson[]>;
  private _matchesSubject: Subject<TinderPerson[]>;

  private _conversationsObservable: Observable<Conversation[]>;
  private _conversationsSubject: Subject<Conversation[]>;

  private _messagesObservable: { [id: string] : Observable<Message[]> } = {};
  private _messagesSubject: { [id: string] : Subject<Message[]> } = {};

  private _profilesObservable: { [id: string] : Observable<TinderProfile> } = {};
  private _profilesSubject: { [id: string] : Subject<TinderProfile> } = {};

  constructor(private _afFirestore: AngularFirestore, private _accService: AccountService, public snackBar: MatSnackBar) {
    this._personsSubject = new ReplaySubject(1);    
    this._matchesSubject = new ReplaySubject(1);    
    this._conversationsSubject = new ReplaySubject(1);    
  }

  public loadMatches(): Observable<TinderPerson[]> {
    if (isNullOrUndefined(this._matchesObservable)) {
      this._matchesObservable = this._afFirestore.collection('tinder')
                          .doc('matches')
                          .collection(this._accService.userData.id)
                          .snapshotChanges()
                          .pipe(map(persons => persons.map(personData => 
                            {
                              let tinderPerson: TinderPerson = new TinderPerson();
                              tinderPerson.id = personData.payload.doc.id;
                              this.loadProfile(tinderPerson.id).subscribe(profile => tinderPerson.profile = profile);
                              return tinderPerson;
                            }))
                          );
      this._matchesObservable.subscribe(matches => this._matchesSubject.next(matches));
    }
    return this._matchesSubject.asObservable();
  }

  public loadPersons(): Observable<TinderPerson[]> {
    if (isNullOrUndefined(this._personsObservable)) {
      this._personsObservable = this._afFirestore.collection('tinder')
                          .doc('persons')
                          .collection(this._accService.userData.id, ref => ref.orderBy('timestamp', 'asc'))
                          .snapshotChanges()
                          .pipe(map(persons => persons.map(personData => 
                            {
                              let tinderPerson: TinderPerson = new TinderPerson();
                              tinderPerson.id = personData.payload.doc.id;
                              this.loadProfile(tinderPerson.id).subscribe(profile => tinderPerson.profile = profile);                              
                              return tinderPerson;
                            }))
                          )
      this._personsObservable.subscribe(persons => this._personsSubject.next(persons));
    }
      // this._personsObservable = this._afFirestore.collection('users')
      //                   .snapshotChanges()
      //                   .pipe(map(persons => persons.map(personData => 
      //                     {
      //                       let tinderPerson: TinderPerson = new TinderPerson();
      //                       tinderPerson.id = personData.payload.doc.id;
      //                       this.loadProfile(tinderPerson.id).subscribe(profile => tinderPerson.profile = profile);                              
      //                       return tinderPerson;
      //                     }))
      //                   )
    return this._personsSubject.asObservable();
  }

  public loadProfile(profileId: string) {
    if (isNullOrUndefined(this._profilesObservable[profileId])) {
      this._profilesObservable[profileId] = this._afFirestore.collection('users')
                          .doc(profileId)
                          .get()
                          .pipe(map(profile => {
                            let tinderProfile:TinderProfile = new TinderProfile();
                            // tinderProfile.description = profile.data().description;
                            tinderProfile.displayImages = profile.data().displayImages;
                            tinderProfile.displayName = profile.data().displayName;
                            tinderProfile.id = profile.id;
                            return tinderProfile;
                          }));
      this._profilesSubject[profileId] = new ReplaySubject(1);
      this._profilesObservable[profileId].subscribe(profile => this._profilesSubject[profileId].next(profile));
    }
    return this._profilesObservable[profileId];
  }
  public likePerson(personId: string) {
    if (this._accService.userData.likesCount <= 0) {
      let snackBarRef = this.snackBar.open('Nu mai ai niciun like ramas. Vei primi in curand altele!', "", {
        duration: 2000,
      });
      return;
    }
    const persArr = new Array<string>();
    persArr.push(this._accService.userData.id);
    persArr.push(personId);
    persArr.sort();
    const fullKey = persArr.join('-');

    this._afFirestore
        .collection('likes')
        .doc(fullKey)
        .set({[this._accService.userData.id] : true}, {merge: true}); 

    this._afFirestore
        .collection('tinder')
        .doc('persons')
        .collection(this._accService.userData.id)
        .doc(personId)
        .delete();
        this._accService.updateData({likesCount: (this._accService.userData.likesCount - 1)});
  }

  public dislikePerson(personId: string) {
    const persArr = new Array<string>();
    persArr.push(this._accService.userData.id);
    persArr.push(personId);
    persArr.sort();
    const fullKey = persArr.join('-');
    const pers: string = persArr[0];

    this._afFirestore
        .collection('likes')
        .doc(fullKey)
        .set({[this._accService.userData.id] : false}, {merge: true});
    this._afFirestore
        .collection('tinder')
        .doc('persons')
        .collection(this._accService.userData.id)
        .doc(personId)
        .delete();
  }

  public getConversations(): Observable<Conversation[]> {
    if (isNullOrUndefined(this._conversationsObservable)) {
      this._conversationsObservable = this._afFirestore
                                              .collection('users')
                                              .doc(this._accService.userData.id)
                                              .collection('conversations', ref => ref.orderBy('lastMessageTime', 'desc'))
                                              .snapshotChanges()
                                              .pipe(map(conversations => {
                                                return conversations.map(convData => {
                                                  let conv: Conversation = convData.payload.doc.data() as Conversation;
                                                  conv.id = convData.payload.doc.id;
                                                  this.loadProfile(convData.payload.doc.data().otherPersonId).subscribe(profile => {
                                                    conv.otherPerson = profile;
                                                  })
                                                  return conv;
                                                });
                                              }));
      this._conversationsObservable.subscribe(conv => this._conversationsSubject.next(conv));
    }
    return this._conversationsSubject.asObservable();
  }

  public getMessages(personId: string): Observable<Message[]> {
    if (isNullOrUndefined(this._messagesObservable[personId])) {
      let conversationParticipants = [this._accService.userData.id , personId];
      let conversationKey: string = conversationParticipants.sort().join('-');
      
      this._messagesObservable[personId] = this._afFirestore
                                              .collection('tinder')
                                              .doc('messages')
                                              .collection(conversationKey, ref => ref.orderBy('timestamp'))
                                              .valueChanges()
                                              .pipe(map(messages => {
                                                return messages.map(messageData => {
                                                  let message: Message = messageData as Message;
                                                  if (messageData.sender == this._accService.userData.id) {
                                                    message.type = MessageType.SENT;
                                                  } else {
                                                    message.type = MessageType.RECEIVED;
                                                  }
                                                  return message;
                                                });
                                              }));
      this._messagesSubject[personId] = new ReplaySubject(1);
      this._messagesObservable[personId].subscribe(messages => this._messagesSubject[personId].next(messages))
    }

    return this._messagesSubject[personId];
  }

  public sendMessage(personId: string, messageText: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let message: Message = new Message();
      message.message = messageText;
      message.sender = this._accService.userData.id;

      let conversationParticipants = [this._accService.userData.id , personId];
      let conversationKey: string = conversationParticipants.sort().join('-');

      let timestamp = firebase.firestore.FieldValue.serverTimestamp();

      this._afFirestore
          .collection('tinder')
          .doc('messages')
          .collection(conversationKey)
          .add(Object.assign({}, {timestamp: timestamp, ...message}))
          .then(result => resolve(result))
          .catch(err => reject(err));
    });
  }

  public saveAnswers(answers: any, score: number): Promise<SaveAnswersStatus> {
    return new Promise<SaveAnswersStatus>((resolve, reject) => {
      this._afFirestore
          .collection('answers')
          .doc(this._accService.userData.id)
          .set(
            {
              answers: answers,
              score: score,
            }
          )
          .then(result => resolve(SaveAnswersStatus.ANSWERS_SUCCESS))
          .catch(err => reject(err));
    });
  }
}

export enum SaveAnswersStatus {
  ANSWERS_ALREADY,
  ANSWERS_UNKNOWN,
  ANSWERS_SUCCESS,
}
