import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { VotePerson } from './Classes';
import { map } from 'rxjs/operators';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  constructor(private _afStore: AngularFirestore, private _accountService: AccountService) { }

  public GetPersons(): Observable<VotePerson[]> {
    return this._afStore.collection('concurenti', ref => ref.orderBy('index'))
      .stateChanges()
      .pipe(map(concurenti => concurenti.map(concurent => {
        const data = concurent.payload.doc.data() as VotePerson;
        const id = concurent.payload.doc.id;
        return { id, ...data };
      })));
  }

  public VoteGirl(girlId: string): Promise<String> {
    return new Promise((resolve, reject)  => {
      if (this._accountService.userData.voteStatus & 2)
        reject("deja votat");
      this._afStore.collection('concurenti').doc(girlId)
                    .collection('votanti').add({votant: this._accountService.userData.id})
                    .then(result => {
                      const voteFlag = this._accountService.userData.voteStatus | 2;
                      this._accountService.updateData({voteStatus: voteFlag});
                      resolve('vote succes!')})
                    .catch(err => reject(err));
    });
  }

  public VoteBoy(boyId: string): Promise<VoteStatus> {
    return new Promise((resolve, reject)  => {
      if (this._accountService.userData.voteStatus & 1)
        reject(VoteStatus.VOTE_ALREADY);
      this._afStore.collection('concurenti').doc(boyId)
                    .collection('votanti').add({votant: this._accountService.userData.id})
                    .then(result => {
                      const voteFlag = this._accountService.userData.voteStatus | 1;
                      this._accountService.updateData({voteStatus: voteFlag});
                      resolve(VoteStatus.VOTE_SUCCESS)})
                    .catch(err => reject(VoteStatus.VOTE_UNKNOWN));
    });
  }
}

export enum VoteStatus {
  VOTE_ALREADY,
  VOTE_UNKNOWN,
  VOTE_SUCCESS,
}
