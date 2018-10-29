import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { map, tap } from 'rxjs/operators';

@Injectable()

export class AuthGuardService implements CanActivate {
  constructor(private _afAuth: AngularFireAuth, private _accService: AccountService, private router: Router) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      if (!isNullOrUndefined(this._accService.userData)) { return true; }

      return this._afAuth.authState
      .pipe( 
        map(user => !!user), 
        tap( (loggedIn: boolean) => { if (!loggedIn) this.router.navigate(['/']); } ) 
        );

  }
}