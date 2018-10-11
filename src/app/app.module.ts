import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MatIconModule } from '@angular/material';
import { MaterialContainerModule } from './material-container-module/material-container-module.module';
import { environment } from '../environments/environment';
import { VoteComponent } from './vote/vote.component';
import { VotingService } from './voting.service';
import { AccountService } from './account.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    VoteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialContainerModule,
    MatIconModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [VotingService, AccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
