import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { VoteComponent } from './vote/vote.component';
import { SwipeComponent } from './tinder/swipe/swipe.component';
import { MatchesComponent } from './tinder/matches/matches.component';
import { ChatComponent } from './tinder/chat/chat.component';
import { QuestionsComponent } from './tinder/questions/questions.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'vote', component: VoteComponent },
  { path: 'tombole', component: LandingComponent },
  { path: 'crush', component: LandingComponent },
  { path: 'tinder', component: QuestionsComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'chat/:id', component: ChatComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}