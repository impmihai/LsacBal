import { Component, OnInit } from '@angular/core';
import { TomboleService } from '../tombole.service';
import { AccountService } from '../account.service';
import { Tombola } from '../Classes';

@Component({
  selector: 'app-tombole',
  templateUrl: './tombole.component.html',
  styleUrls: ['./tombole.component.css']
})
export class TomboleComponent implements OnInit {
  tombole: Tombola[];
  constructor(private _tomboleService: TomboleService, private _accService: AccountService) { }

  ngOnInit() {
    this._tomboleService.GetTombole().subscribe(tombole => this.tombole = tombole);
  }

  isRegisteredForTombola(id: number): Boolean {
    return this._tomboleService.IsRegistered(id);
  }
}
