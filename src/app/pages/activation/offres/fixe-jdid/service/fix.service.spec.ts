import { TestBed } from '@angular/core/testing';

import { FixService } from './fix.service';

describe('FixService', () => {
  let service: FixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
