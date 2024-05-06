import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLogFilterComponent } from './report-log-filter.component';

describe('ReportLogFilterComponent', () => {
  let component: ReportLogFilterComponent;
  let fixture: ComponentFixture<ReportLogFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportLogFilterComponent]
    });
    fixture = TestBed.createComponent(ReportLogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
