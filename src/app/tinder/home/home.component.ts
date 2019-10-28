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
  chatName = false;
  constructor(private router: Router) {
    this.routeLinks = [
      {
        link: './swipe',
        visible: 1
      },
      {
        link: './matches',
        visible: 1
      },
      {
        link: './tinder',
        visible: 0
      },
      {
        link: './chat',
        visible: 2
      },
      {
        link: './',
        visible: 0
      },
    ];
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      const currTab = this.routeLinks.find(tab =>  ('.' + this.router.url).indexOf(tab.link) >= 0);
      this.activeLinkIndex = this.routeLinks.indexOf(currTab);
      this.visible = currTab.visible === 1;
      this.chatName = currTab.visible === 2;
    });
  }

}
