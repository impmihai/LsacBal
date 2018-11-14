import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RezultateTomboleComponent } from './rezultate-tombole.component';

describe('RezultateTomboleComponent', () => {
  let component: RezultateTomboleComponent;
  let fixture: ComponentFixture<RezultateTomboleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RezultateTomboleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RezultateTomboleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
