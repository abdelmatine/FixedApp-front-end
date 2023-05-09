import { TestBed } from '@angular/core/testing';

import { ProspService } from './prosp.service';

describe('ProspService', () => {
  let service: ProspService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProspService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
