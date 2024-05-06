import { TestBed } from '@angular/core/testing';

import { FileLogService } from './file-log.service';

describe('FileLogService', () => {
  let service: FileLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
