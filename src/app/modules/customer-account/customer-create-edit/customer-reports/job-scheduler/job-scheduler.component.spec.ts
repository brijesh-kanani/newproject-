import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSchedulerComponent } from './job-scheduler.component';

describe('JobSchedulerComponent', () => {
  let component: JobSchedulerComponent;
  let fixture: ComponentFixture<JobSchedulerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobSchedulerComponent]
    });
    fixture = TestBed.createComponent(JobSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
