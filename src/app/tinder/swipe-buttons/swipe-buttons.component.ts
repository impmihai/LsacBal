import { Component, OnInit, Input } from '@angular/core';
import { TinderPerson } from '../../Classes';
import { TinderService } from '../tinder.service';

@Component({
  selector: 'app-swipe-buttons',
  templateUrl: './swipe-buttons.component.html',
  styleUrls: ['./swipe-buttons.component.css']
})
export class SwipeButtonsComponent implements OnInit {
  @Input() person: TinderPerson
  constructor(public tinderService: TinderService) { }

  ngOnInit() {}

}
