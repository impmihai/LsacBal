import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { VoteComponent } from './vote/vote.component';
import { SwipeComponent } from './tinder/swipe/swipe.component';
import { MatchesComponent } from './tinder/matches/matches.component';
import { ChatComponent } from './tinder/chat/chat.component';
import { QuestionsComponent } from './tinder/questions/questions.component';
import { AuthGuardService } from './auth-guard.service';
import { HomeComponent } from './tinder/home/home.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'tinder', component: QuestionsComponent },
  { path: 'swipe', component: SwipeComponent, canActivate: [AuthGuardService] },
  { path: 'matches', component: MatchesComponent },
  { path: 'chat/:id', component: ChatComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}