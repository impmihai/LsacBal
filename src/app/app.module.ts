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
import { SwipeComponent } from './tinder/swipe/swipe.component';
import { MatchesComponent } from './tinder/matches/matches.component';
import { ChatComponent } from './tinder/chat/chat.component';
import { QuestionsComponent } from './tinder/questions/questions.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    VoteComponent,
    SwipeComponent,
    MatchesComponent,
    ChatComponent,
    QuestionsComponent
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
    FormsModule,
  ],
  providers: [VotingService, AccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
