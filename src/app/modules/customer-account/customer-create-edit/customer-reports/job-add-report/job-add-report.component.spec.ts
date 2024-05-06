import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAddReportComponent } from './job-add-report.component';

describe('JobAddReportComponent', () => {
  let component: JobAddReportComponent;
  let fixture: ComponentFixture<JobAddReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobAddReportComponent]
    });
    fixture = TestBed.createComponent(JobAddReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
