import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TomboleService } from '../tombole.service';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tombola } from '../Classes';
import { PARAMETERS } from '@angular/core/src/util/decorators';

@Component({
  selector: 'app-tombola-register',
  templateUrl: './tombola-register.component.html',
  styleUrls: ['./tombola-register.component.css']
})
export class TombolaRegisterComponent implements OnInit {
  tombola: Tombola;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params.id);
      
      this._tomboleService.GetTombola(params.id).subscribe(t => {
        console.log(t);
        this.tombola = t;
      });
    });
    
  }

  constructor(private _router: Router, private _tomboleService: TomboleService, private _accountService: AccountService, private route: ActivatedRoute) {
  }

  addVisible = true;
  public closeAdd() {
      this.addVisible = false;
  }

  public SignToTombola(form: NgForm) {
    console.log(form.value);

    // this._tomboleService.Register(this.route.snapshot.params['id']);
    
      this._tomboleService.Register(this.tombola.id, form.value).then(redirect => {
        this._router.navigateByUrl('/tombole');
      });
  }

  public navigateAway() {
    this._router.navigateByUrl('/tombole');    
  }
}
