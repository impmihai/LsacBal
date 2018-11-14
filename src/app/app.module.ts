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
import { MessagingService } from './messaging.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireMessaging, AngularFireMessagingModule } from '@angular/fire/messaging';
import { AuthGuardService } from './auth-guard.service';
import { SwipeCardComponent } from './tinder/swipe-card/swipe-card.component';
import { HomeComponent } from './tinder/home/home.component';
import { MyProfileComponent } from './tinder/my-profile/my-profile.component';
import { SwipeButtonsComponent } from './tinder/swipe-buttons/swipe-buttons.component';
import { GoldComponent } from './gold/gold.component';
import { TomboleComponent } from './tombole/tombole.component';
import { TombolaRegisterComponent } from './tombola-register/tombola-register.component';
import { RezultateComponent } from './rezultate/rezultate.component';
import { TomboleService } from './tombole.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    VoteComponent,
    SwipeComponent,
    MatchesComponent,
    ChatComponent,
    QuestionsComponent,
    SwipeCardComponent,
    HomeComponent,
    MyProfileComponent,
    SwipeButtonsComponent,
    GoldComponent,
    TomboleComponent,
    TombolaRegisterComponent,
    RezultateComponent,
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
    AngularFireMessagingModule,
    FormsModule,
  ],
  providers: [VotingService, AccountService, MessagingService, AngularFireDatabase, AuthGuardService, TomboleService, VotingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
