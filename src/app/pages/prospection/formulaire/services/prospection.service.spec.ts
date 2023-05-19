import { TestBed } from '@angular/core/testing';

import { ProspectionService } from './prospection.service';

describe('ProspectionServiceService', () => {
  let service: ProspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
