import { Component, OnInit } from '@angular/core';
import { VotePerson, Tombola } from '../Classes';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

export class tbl {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-rezultate-tombole',
  templateUrl: './rezultate-tombole.component.html',
  styleUrls: ['./rezultate-tombole.component.css']
})
export class RezultateTomboleComponent implements OnInit {
  displayedColumns: string[] = ['name', 'surname', 'email', 'phone'];

  dataSource: tbl[];

  
    

  constructor(private route: ActivatedRoute, private _afFirestore: AngularFirestore) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params.id;
      this._afFirestore.collection('tombole').doc(id).collection('participanti').get().pipe(map(users => users.docs.map(userData => {
        return userData.data() as tbl;
      }))).subscribe(a => this.dataSource = a);
    });
  }
}
