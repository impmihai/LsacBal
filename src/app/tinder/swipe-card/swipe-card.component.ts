import { Component, OnInit, Input } from '@angular/core';
import { TinderProfile, TinderPerson } from '../../Classes';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.css']
})
export class SwipeCardComponent implements OnInit {
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }
  @Input() person: TinderPerson;
  constructor() { }
  public carouselTileItems: Array<any>;
}
