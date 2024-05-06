import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShowHourMinutesComponent } from './time-show-hour-minutes.component';

describe('TimeShowHourMinutesComponent', () => {
  let component: TimeShowHourMinutesComponent;
  let fixture: ComponentFixture<TimeShowHourMinutesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeShowHourMinutesComponent]
    });
    fixture = TestBed.createComponent(TimeShowHourMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
