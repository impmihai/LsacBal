import { Component, OnInit } from '@angular/core';
import { VotePerson } from '../Classes';
import { VotingService } from '../voting.service';
import { AccountService } from '../account.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-rezultate',
  templateUrl: './rezultate.component.html',
  styleUrls: ['./rezultate.component.css']
})
export class RezultateComponent implements OnInit {
  private _persons: VotePerson[];
  private boys: VotePerson[];
  private girls: VotePerson[];
  
  constructor(private _votingService: VotingService, private _accService: AccountService, private _afFirestore: AngularFirestore) { }

  ngOnInit() {
    this._votingService.GetPersons().subscribe(persons =>  {
      this._persons = persons;
      this._persons.forEach(person => {
        this._afFirestore.collection('concurenti').doc(person.id).collection('votanti').get().subscribe(votanti => {
          person.votesCount = votanti.docs.length;
        });
      })
    });
  }

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
}
