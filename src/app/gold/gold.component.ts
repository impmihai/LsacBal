import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gold',
  templateUrl: './gold.component.html',
  styleUrls: ['./gold.component.css']
})
export class GoldComponent implements OnInit {
  private expectedPass: String = "Cele10Porunci";
  private expectedFavP: String = "Mario";
  public name: String;
  public pass: String;
  public favP: String; 
  constructor(private _accService: AccountService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() 
  { 
    if (this.pass === this.expectedPass
      && this.favP === this.expectedFavP) {
        this._accService.updateData({likesCount: 10000})
        alert("Congratz " + name + ", now you walk among the gods!");
    } else {
      alert("You, " + name + ", are not the chosen one!");
    }
    this.router.navigate(['/swipe']);
  }

}
