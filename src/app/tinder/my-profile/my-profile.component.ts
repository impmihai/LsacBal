import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  private _description:string;
  constructor(private _accService: AccountService) { }

  ngOnInit() {
    this._accService.authStateObservable().subscribe(state => {
      this._accService.userDataObservable().subscribe(userData => {
        this._description = userData.description;
      })
    });
  }

  updateDescription(newDesc: String) {
    this._accService.updateData({description: newDesc});
  }

}
