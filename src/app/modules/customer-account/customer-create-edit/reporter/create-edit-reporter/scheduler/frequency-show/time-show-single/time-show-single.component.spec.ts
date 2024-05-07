import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShowSingleComponent } from './time-show-single.component';

describe('TimeShowSingleComponent', () => {
  let component: TimeShowSingleComponent;
  let fixture: ComponentFixture<TimeShowSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeShowSingleComponent]
    });
    fixture = TestBed.createComponent(TimeShowSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
