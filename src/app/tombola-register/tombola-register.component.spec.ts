import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TombolaRegisterComponent } from './tombola-register.component';

describe('TombolaRegisterComponent', () => {
  let component: TombolaRegisterComponent;
  let fixture: ComponentFixture<TombolaRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TombolaRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TombolaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
