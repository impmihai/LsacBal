import { Component, OnInit } from '@angular/core';
import { VotingService } from '../voting.service';
import { Observable } from 'rxjs';
import { VotePerson, Sex } from '../Classes';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  private _persons: VotePerson[];
  constructor(private _votingService: VotingService, private _accService: AccountService) { }

  getBoys(): VotePerson[] {
    const boys = [];
    for (let i = 0; i < this._persons.length; i++) {
      if (!!(i % 2))
        boys.push(this._persons[i]);
    }
    return boys;
  }

  getGirls(): VotePerson[] {
    const girls = [];
    for (let i = 0; i < this._persons.length; i++) {
      if (!(i % 2))
      girls.push(this._persons[i]);
    }
    return girls;
  }

  votedForGirl(): boolean {
    return (this._accService.userData.voteStatus & 2) != 0;
  }

  votedForBoy(): boolean {
    return (this._accService.userData.voteStatus & 1) != 0;
  }

  onClick(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    var id = value.split('|')[1];
    var index = value.split('|')[0];
    this._persons[index].infoVisible = !this._persons[index].infoVisible;
    if (index % 2 == 0) {
      this._votingService.VoteGirl(id);
    } else {
      this._votingService.VoteBoy(id);
    }
  }

  voteBoy(id: string) {
    this._votingService.VoteBoy(id);
  }

  voteGirl(id: string) {
    this._votingService.VoteGirl(id);
  }

  
  ngOnInit() {
    this._votingService.GetPersons().subscribe(persons => this._persons = persons);
    this._accService.isLoggedIn().subscribe(status => {
      if (status == true) {
        this._accService.userDataObservable().subscribe(data => console.log(data));
      }
    });
    // this._afirestore.collection('concurenti').add({
    //   description: this.stringGen(234),
    //   displayImage: this.stringGen(28),
    //   displayName: this.stringGen(16),
    //   type: 0
    // })
  }
}
