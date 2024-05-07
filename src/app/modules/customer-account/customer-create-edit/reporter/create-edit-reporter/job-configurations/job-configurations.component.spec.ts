import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobConfigurationsComponent } from './job-configurations.component';

describe('JobConfigurationsComponent', () => {
  let component: JobConfigurationsComponent;
  let fixture: ComponentFixture<JobConfigurationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobConfigurationsComponent]
    });
    fixture = TestBed.createComponent(JobConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
