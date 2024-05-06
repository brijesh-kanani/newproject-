import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShowHourComponent } from './time-show-hour.component';

describe('TimeShowHourComponent', () => {
  let component: TimeShowHourComponent;
  let fixture: ComponentFixture<TimeShowHourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeShowHourComponent]
    });
    fixture = TestBed.createComponent(TimeShowHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
