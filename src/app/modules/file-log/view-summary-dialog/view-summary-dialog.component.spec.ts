import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSummaryDialogComponent } from './view-summary-dialog.component';

describe('ViewSummaryDialogComponent', () => {
  let component: ViewSummaryDialogComponent;
  let fixture: ComponentFixture<ViewSummaryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSummaryDialogComponent]
    });
    fixture = TestBed.createComponent(ViewSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
