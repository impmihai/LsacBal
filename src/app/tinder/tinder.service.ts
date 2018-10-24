import { Injectable } from '@angular/core';
import { AccountInfo, Message, MessageType, TinderProfile, TinderPerson } from 'src/app/Classes';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AccountService } from '../account.service';
import { isNullOrUndefined } from 'util';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class TinderService {
  private _personsObservable: Observable<any>;
  private _matchesObservable: Observable<any>;
  private _messagesObservable: { [id: string] : Observable<Message[]> } = {};
  private _profilesObservable: { [id: string] : Observable<TinderProfile> } = {};
  constructor(private _afFirestore: AngularFirestore, private _accService: AccountService) { }

  public getMyMatches(): Observable<AccountInfo> {
    if (isNullOrUndefined(this._matchesObservable))
      this._matchesObservable = this._afFirestore.collection('tinder')
                          .doc('matches')
                          .collection(this._accService.userData.id)
                          .snapshotChanges();
    return this._matchesObservable;
  }

  public loadPersons(): Observable<TinderPerson[]> {
    if (isNullOrUndefined(this._personsObservable))
      this._personsObservable = this._afFirestore.collection('tinder')
                          .doc('persons')
                          .collection(this._accService.userData.id)
                          .snapshotChanges()
                          .pipe(map(persons => persons.map(personData => 
                            {
                              let tinderPerson: TinderPerson = new TinderPerson();
                              tinderPerson.id = personData.payload.doc.id;
                              tinderPerson.profile = this.loadProfile(tinderPerson.id);
                              return tinderPerson;
                            }))
                          )
    return this._personsObservable;
  }

  public loadProfile(profileId: string) {
    if (isNullOrUndefined(this._profilesObservable[profileId])) {
      this._profilesObservable[profileId] = this._afFirestore.collection('users')
                          .doc(profileId)
                          .get()
                          .pipe(map(profile => {
                            let tinderProfile:TinderProfile = new TinderProfile();
                            tinderProfile.description = profile.data().description;
                            tinderProfile.displayImages = profile.data().displayImages;
                            tinderProfile.displayName = profile.data().displayName;
                            tinderProfile.id = profile.id;
                            return tinderProfile;
                          }));
    }
    return this._profilesObservable[profileId];
  }

  public likePerson(personId: string) {
    const persArr = new Array<string>();
    persArr.push(this._accService.userData.id);
    persArr.push(personId);
    persArr.sort();
    const fullKey = persArr.join('-');

    this._afFirestore
        .collection('likes')
        .doc(fullKey)
        .set({[this._accService.userData.id] : true}, {merge: true}); 
  }

  public dislikePerson(personId: string) {
    const persArr = new Array<string>();
    persArr.push(this._accService.userData.id);
    persArr.push(personId);
    persArr.sort();
    const fullKey = persArr.join('-');
    const pers: string = persArr[0];

    this._afFirestore
        .collection('users')
        .doc(pers)
        .update({['like-' + fullKey] : false});
  }

  public getMessages(personId: string): Observable<Message[]> {
    if (isNullOrUndefined(this._messagesObservable[personId])) {
      let conversationParticipants = [this._accService.userData.id , personId];
      let conversationKey: string = conversationParticipants.sort().join('-');
      
      this._messagesObservable[personId] = this._afFirestore
                                              .collection('tinder')
                                              .doc('messages')
                                              .collection(conversationKey)
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
    }

    return this._messagesObservable[personId];
  }

  public sendMessage(personId: string, messageText: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let message: Message = new Message();
      message.message = messageText;
      message.sender = this._accService.userData.id;
      message.receiver = personId;

      let conversationParticipants = [this._accService.userData.id , personId];
      let conversationKey: string = conversationParticipants.sort().join('-');

      this._afFirestore
          .collection('tinder')
          .doc('messages')
          .collection(conversationKey)
          .add(message)
          .then(result => resolve(result))
          .catch(err => reject(err));
    });
  }

  public saveAnswers(answers: any): Promise<SaveAnswersStatus> {
    return new Promise<SaveAnswersStatus>((resolve, reject) => {
      console.log(answers);
      this._afFirestore
          .collection('tinder')
          .doc('answers')
          .set({ [this._accService.userData.id]: answers })
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
