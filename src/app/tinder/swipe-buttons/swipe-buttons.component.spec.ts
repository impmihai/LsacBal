import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeButtonsComponent } from './swipe-buttons.component';

describe('SwipeButtonsComponent', () => {
  let component: SwipeButtonsComponent;
  let fixture: ComponentFixture<SwipeButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwipeButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwipeButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
