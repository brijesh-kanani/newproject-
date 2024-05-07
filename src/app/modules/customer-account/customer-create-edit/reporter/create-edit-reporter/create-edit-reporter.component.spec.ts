import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditReporterComponent } from './create-edit-reporter.component';

describe('CreateEditReporterComponent', () => {
  let component: CreateEditReporterComponent;
  let fixture: ComponentFixture<CreateEditReporterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditReporterComponent]
    });
    fixture = TestBed.createComponent(CreateEditReporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
