import { Component, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MessagingService } from './messaging.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private message;

  @ViewChild('fbDialog') fbDialog: TemplateRef<any>;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    private _messagingService: MessagingService,
    private _changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    const ua = navigator.userAgent || navigator.vendor;

    const isFacebookApp = () => ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1 || ua.indexOf('FBSN') > -1;

    if (isFacebookApp()) {
      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(this.fbDialog, {
      width: '80vw',
    });
  }
}
