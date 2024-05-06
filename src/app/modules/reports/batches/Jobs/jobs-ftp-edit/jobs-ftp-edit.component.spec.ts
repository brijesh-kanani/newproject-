import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsFtpEditComponent } from './jobs-ftp-edit.component';

describe('JobsFtpEditComponent', () => {
  let component: JobsFtpEditComponent;
  let fixture: ComponentFixture<JobsFtpEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobsFtpEditComponent]
    });
    fixture = TestBed.createComponent(JobsFtpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
