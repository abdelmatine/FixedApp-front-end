import { TestBed } from '@angular/core/testing';

import { ProspectionServiceService } from './prospection.service.service';

describe('ProspectionServiceService', () => {
  let service: ProspectionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProspectionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
