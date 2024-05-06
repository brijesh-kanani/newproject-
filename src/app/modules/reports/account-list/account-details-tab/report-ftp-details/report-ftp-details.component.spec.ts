import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFtpDetailsComponent } from './report-ftp-details.component';

describe('ReportFtpDetailsComponent', () => {
  let component: ReportFtpDetailsComponent;
  let fixture: ComponentFixture<ReportFtpDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportFtpDetailsComponent]
    });
    fixture = TestBed.createComponent(ReportFtpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
