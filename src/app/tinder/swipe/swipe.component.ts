import { Component, OnInit } from '@angular/core';
import { TinderService } from '../tinder.service';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.css']
})
export class SwipeComponent implements OnInit {
  private _matches: any[];
  constructor(private _tinderService: TinderService) { }

  ngOnInit() {
    this._tinderService.loadPersons().subscribe(matches => this._matches = matches);
  }
}
