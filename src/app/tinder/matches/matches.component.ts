import { Component, OnInit } from '@angular/core';
import { TinderService } from '../tinder.service';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  constructor(private tinderService: TinderService) { }

  ngOnInit() {
  }

}
