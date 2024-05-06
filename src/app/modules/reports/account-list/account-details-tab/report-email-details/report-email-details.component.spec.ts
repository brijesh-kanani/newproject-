import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEmailDetailsComponent } from './report-email-details.component';

describe('ReportEmailDetailsComponent', () => {
  let component: ReportEmailDetailsComponent;
  let fixture: ComponentFixture<ReportEmailDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportEmailDetailsComponent]
    });
    fixture = TestBed.createComponent(ReportEmailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
