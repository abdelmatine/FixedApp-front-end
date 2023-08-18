import { TestBed } from '@angular/core/testing';

import { SousTraitantService } from './sous-traitant.service';

describe('SousTraitantService', () => {
  let service: SousTraitantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousTraitantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
