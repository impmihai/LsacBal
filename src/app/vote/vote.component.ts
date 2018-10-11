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

  // stringGen(len) {
  //   var text = "";
    
  //   var charset = "       abcdefghijklmnopqrstuvwxyz0123456789";
    
  //   for (var i = 0; i < len; i++)
  //     text += charset.charAt(Math.floor(Math.random() * charset.length));
    
  //   return text;
  // }
  
  onClick(event) {
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    this._persons[value].infoVisible = !this._persons[value].infoVisible;
  }
  
  ngOnInit() {
    this._votingService.GetPersons().subscribe(persons => this._persons = persons);
    this._votingService.GetPersons().subscribe(i => console.log(i));
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
