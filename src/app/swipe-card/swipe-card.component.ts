import { Component, OnInit, Input } from '@angular/core';
import { TinderProfile } from '../Classes';
import { NguCarouselConfig, NguCarousel } from '@ngu/carousel';

@Component({
  selector: 'app-swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.css']
})
export class SwipeCardComponent implements OnInit {
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }
  @Input() profile: TinderProfile;
  constructor() { }
  public carouselTileItems: Array<any>;
}
