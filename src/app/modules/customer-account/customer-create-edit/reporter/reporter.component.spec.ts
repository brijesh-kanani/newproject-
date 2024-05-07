import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporterComponent } from './reporter.component';

describe('ReporterComponent', () => {
  let component: ReporterComponent;
  let fixture: ComponentFixture<ReporterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporterComponent]
    });
    fixture = TestBed.createComponent(ReporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
