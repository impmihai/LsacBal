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
import { GoldComponent } from './gold/gold.component';
import { TomboleComponent } from './tombole/tombole.component';
import { TombolaRegisterComponent } from './tombola-register/tombola-register.component';
import { RezultateComponent } from './rezultate/rezultate.component';
import { RezultateTomboleComponent } from './rezultate-tombole/rezultate-tombole.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'tinder', component: QuestionsComponent, canActivate: [AuthGuardService] },
  { path: 'vote', component: VoteComponent, canActivate: [AuthGuardService] },
  //{ path: 'tombole', component: TomboleComponent, canActivate: [AuthGuardService] },
  { path: 'swipe', component: SwipeComponent, canActivate: [AuthGuardService] },
  { path: 'gold', component: GoldComponent, canActivate: [AuthGuardService] },
  { path: 'matches', component: MatchesComponent, canActivate: [AuthGuardService] },
  { path: 'tombole', component: TomboleComponent, canActivate: [AuthGuardService] },
  { path: 'tombola/:id', component: TombolaRegisterComponent, canActivate: [AuthGuardService] },
  { path: 'rezultate', component: RezultateComponent },
  { path: 'rezultateTombola/:id', component: RezultateTomboleComponent },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuardService] },
 
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}