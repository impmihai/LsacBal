import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AccountInfo } from './Classes';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { map } from 'rxjs/operators';
import { ObserversModule } from '@angular/cdk/observers';
import { reject } from 'q';
import { ReadKeyExpr } from '@angular/compiler';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private static usersDb: string = 'users';
  private _userDataObservable: Observable<AccountInfo>;
  public userData: AccountInfo;
  private _authState: firebase.User;

  constructor(private _afStore: AngularFirestore, private _afAuth: AngularFireAuth) {
    this._afAuth.authState.subscribe(auth => {
      this._authState = auth;
      this.userDataObservable().subscribe(a => {});
    });
  }
  


  authStateObservalbe(): Observable<firebase.User> {
    return this._afAuth.authState;
  }

  doLogout(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._afAuth.auth.signOut().then(res => resolve(res)).catch(res => reject(res));
    });
  }

  doFacebookLogin(): Promise<any>{
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this._afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        this._afStore.collection(AccountService.usersDb).doc(res.user.uid).get().subscribe(docSnapshot => {
          if (!docSnapshot.exists) {
            this._afStore.collection(AccountService.usersDb).doc(res.user.uid).set({
              displayName: res.user.displayName,
              displayImages: [res.user.photoURL]
            });
          }});
        resolve(res);
      }, err => {
        reject(err);
      })
    });
  }

  public isLoggedIn(): Observable<Boolean> {
    return new Observable(observer => {
      this._afAuth.authState.subscribe(val => {
        if (val != null)
          observer.next(true);
        else
          observer.next(false);
      });
    });
  }

  public userDataObservable(): Observable<AccountInfo> {
    console.log(this._userDataObservable);
    if (isNullOrUndefined(this._userDataObservable)) {
      this._userDataObservable = this._afStore.collection(AccountService.usersDb).doc(this._authState.uid)
        .valueChanges()
        .pipe(map(userData => {
          this.userData = userData as AccountInfo;
          this.userData.id = this._authState.uid;
          return this.userData;
        }));
    }
    return this._userDataObservable;
  }

  public updateData(data): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._afStore
          .collection(AccountService.usersDb)
          .doc(this._authState.uid)
          .update(data)
          .then(res => resolve(res))
          .catch(err => reject(err));
    });
  }
}
