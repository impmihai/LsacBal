import { TestBed, inject } from '@angular/core/testing';

import { TinderService } from './tinder.service';

describe('TinderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TinderService]
    });
  });

  it('should be created', inject([TinderService], (service: TinderService) => {
    expect(service).toBeTruthy();
  }));
});
