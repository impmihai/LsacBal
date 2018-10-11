import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { VoteComponent } from './vote/vote.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'vote', component: VoteComponent },
  { path: 'tombole', component: LandingComponent },
  { path: 'crush', component: LandingComponent },
  { path: 'tinder', component: LandingComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}