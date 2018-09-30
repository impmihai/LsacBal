import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.firestore.collection('home').doc('cacat').set({
      'titlu' : 'cacat'
    }).then(result => console.log(result)).catch(result => console.log(result));
  }

}
