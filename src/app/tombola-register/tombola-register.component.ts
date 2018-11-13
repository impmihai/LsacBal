import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TomboleService } from '../tombole.service';
import { AccountService } from '../account.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tombola-register',
  templateUrl: './tombola-register.component.html',
  styleUrls: ['./tombola-register.component.css']
})
export class TombolaRegisterComponent implements OnInit {
   
  ngOnInit(): void {
  }

  constructor(private _tomboleService: TomboleService, private _accountService: AccountService, private route: ActivatedRoute) {
  }

  addVisible = true;
  public closeAdd() {
      this.addVisible = false;
  }

  public SignToTombola(form: NgForm) {
    // this._tomboleService.Register(this.route.snapshot.params['id']);
    
    //   this.accService.registerForTombola(this.tombola, form.value);
    //   this.router.navigateByUrl('/tombole');
  }
}
