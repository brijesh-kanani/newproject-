import { TestBed } from '@angular/core/testing';

import { ReporterService } from './reporter.service';

describe('ReporterService', () => {
  let service: ReporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
