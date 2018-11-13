import { TestBed, inject } from '@angular/core/testing';

import { TomboleService } from './tombole.service';

describe('TomboleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TomboleService]
    });
  });

  it('should be created', inject([TomboleService], (service: TomboleService) => {
    expect(service).toBeTruthy();
  }));
});
