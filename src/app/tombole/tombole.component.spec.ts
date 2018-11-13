import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TomboleComponent } from './tombole.component';

describe('TomboleComponent', () => {
  let component: TomboleComponent;
  let fixture: ComponentFixture<TomboleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TomboleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TomboleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
