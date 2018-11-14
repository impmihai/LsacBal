import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Tombola } from './Classes';
import { map } from 'rxjs/operators';
import { AccountService } from './account.service';
import { isNullOrUndefined } from 'util';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TomboleService {
  private _tomboleSubject: Subject<Tombola[]>;
  private _tomboleObservable: Observable<Tombola[]>;

  private _tombolaObservable: { [id: string] : Observable<Tombola> } = {};
  private _tombolaSubject: { [id: string] : Subject<Tombola> } = {};

  constructor(private _afStore: AngularFirestore, private _accService: AccountService) {
    this._tomboleSubject = new ReplaySubject(1);
  }

  public GetTombola(tombolaId: string): Observable<Tombola> {
    console.log(tombolaId);
    if (isNullOrUndefined(this._tombolaObservable[tombolaId])) {
      this._tombolaObservable[tombolaId] = this._afStore.collection('tombole')
                                            .doc(tombolaId)
                                            .get()
                                            .pipe(map(tombolaData => {
                                              const tombola: Tombola =  tombolaData.data() as Tombola;
                                              tombola.id = Number(tombolaData.id);
                                              return tombola;
                                            }));
      this._tombolaSubject[tombolaId] = new ReplaySubject(1);
      this._tombolaSubject[tombolaId].subscribe(val => {
        this._tombolaSubject[tombolaId].next(val);
      });
    }
    return this._tombolaObservable[tombolaId];
  }

  public GetTombole(): Observable<Tombola[]> {
    if (isNullOrUndefined(this._tomboleObservable)) {
      this._tomboleObservable = this._afStore.collection('tombole')
                                            .stateChanges()
                                            .pipe(map(tombole => tombole.map(tombolaData => {
                                              const tombola: Tombola =  tombolaData.payload.doc.data() as Tombola;
                                              tombola.id = Number(tombolaData.payload.doc.id);
                                              return tombola;
                                            })));
      this._tomboleObservable.subscribe(val => this._tomboleSubject.next(val));
    }
    return this._tomboleSubject.asObservable();
  }

  public IsRegistered(id: number): Boolean {
    if (this._accService.userData.tomboleStatus & id) {
      return true;
    }
    return false;
  }

  public async Register(id: number, data: any): Promise<any> {
    const flag = this._accService.userData.tomboleStatus | id;
    await this._accService.updateData({tomboleStatus: flag});
    await this._afStore.collection('tombole').doc(id + '').collection('participanti').doc(this._accService.userData.id).set(data);
  }
}
