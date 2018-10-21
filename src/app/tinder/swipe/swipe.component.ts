import { Component, OnInit } from '@angular/core';
import { TinderService } from '../tinder.service';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.css']
})
export class SwipeComponent implements OnInit {
  private _persons: any[];
  constructor(private _accService:AccountService, private _tinderService: TinderService) { }

private _imageUrl: string;

  ngOnInit() {
    this._accService.authStateObservalbe().subscribe(caca => {
      
    });
  }
}
