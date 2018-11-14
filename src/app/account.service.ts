import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AccountInfo } from './Classes';
import * as firebase from 'firebase';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { map } from 'rxjs/operators';
import { ObserversModule } from '@angular/cdk/observers';
import { reject } from 'q';
import { ReadKeyExpr } from '@angular/compiler';
import { promise } from 'protractor';
import { MessagingService } from './messaging.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private static usersDb: string = 'users';
  private _userDataObservable: Observable<AccountInfo>;
  public userData: AccountInfo;
  private _authState: firebase.User;
  private _token: string;

  private _userDataSubject: Subject<AccountInfo>;
  
  constructor(private _messagingService: MessagingService, private _afStore: AngularFirestore, private _afAuth: AngularFireAuth, private snackBar: MatSnackBar) {
    this._userDataSubject = new ReplaySubject(1);
    
    this._messagingService.requestPermission().then(token => {
        this._token = token;
        if (!isNullOrUndefined(this.userData)) {
          this.updateData({fcmtoken: this._token});
        }
     });
    this._messagingService.receiveMessage();
    this._messagingService.currentMessage.subscribe(tst => {
      // this.snackBar.open(tst.data.text, "", {
      //   duration: 2000,
      // })
    });

    this._afAuth.authState.subscribe(auth => {
      console.log(auth);
      if (auth != null) {
        this._authState = auth;
        this.userDataObservable().subscribe(a => {
          if (!isNullOrUndefined(this._token)) {
            this.updateData({fcmtoken: this._token});
          }
        });
      }        
    });
  }
  


  authStateObservable(): Observable<firebase.User> {
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
              displayImages: [res.user.photoURL + '?width=256&height=256'],
              description: '',
              workplace: '',
              likesCount: 20
            }).then(a => {
              location.reload();
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
    if (isNullOrUndefined(this._userDataObservable)) {
      this._userDataObservable = this._afStore.collection(AccountService.usersDb).doc(this._authState.uid)
        .valueChanges()
        .pipe(map(userData => {
          this.userData = userData as AccountInfo;
          this.userData.id = this._authState.uid;
          return this.userData;
        }));
        this._userDataObservable.subscribe(val => this._userDataSubject.next(val));
    }
    
    return this._userDataSubject.asObservable();
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
