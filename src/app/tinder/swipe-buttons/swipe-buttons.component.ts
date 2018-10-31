import { Component, OnInit, Input } from '@angular/core';
import { TinderProfile, TinderPerson } from '../../Classes';
import { TinderService } from '../tinder.service';

@Component({
  selector: 'app-swipe-buttons',
  templateUrl: './swipe-buttons.component.html',
  styleUrls: ['./swipe-buttons.component.css']
})
export class SwipeButtonsComponent implements OnInit {
  @Input() person: TinderPerson
  constructor(private _tinderService: TinderService) { }

  ngOnInit() {

  }

}
