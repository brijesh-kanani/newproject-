import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobReportDialogComponent } from './edit-job-report-dialog.component';

describe('EditJobReportDialogComponent', () => {
  let component: EditJobReportDialogComponent;
  let fixture: ComponentFixture<EditJobReportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditJobReportDialogComponent]
    });
    fixture = TestBed.createComponent(EditJobReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
