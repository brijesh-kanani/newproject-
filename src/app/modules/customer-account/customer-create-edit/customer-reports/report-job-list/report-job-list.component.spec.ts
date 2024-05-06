import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportJobListComponent } from './report-job-list.component';

describe('ReportJobListComponent', () => {
  let component: ReportJobListComponent;
  let fixture: ComponentFixture<ReportJobListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportJobListComponent]
    });
    fixture = TestBed.createComponent(ReportJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
