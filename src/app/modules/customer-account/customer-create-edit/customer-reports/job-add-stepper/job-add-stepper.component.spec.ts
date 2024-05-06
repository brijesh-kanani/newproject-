import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAddStepperComponent } from './job-add-stepper.component';

describe('JobAddStepperComponent', () => {
  let component: JobAddStepperComponent;
  let fixture: ComponentFixture<JobAddStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobAddStepperComponent]
    });
    fixture = TestBed.createComponent(JobAddStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
