import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  routeLinks: any[];
  activeLinkIndex = -1;
  visible = false;
  constructor(private router: Router) {
    this.routeLinks = [
      {
        link: './swipe',
        visible: true
      },
      {
        link: './matches',
        visible: true
      },
      {
        link: './tinder',
        visible: false
      },
      {
        link: './chat',
        visible: true
      },
      {
        link: './',
        visible: false
      },
    ];
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      const currTab = this.routeLinks.find(tab =>  ('.' + this.router.url).indexOf(tab.link) >= 0);
      this.activeLinkIndex = this.routeLinks.indexOf(currTab);
      this.visible = currTab.visible;
    });
  }

}
