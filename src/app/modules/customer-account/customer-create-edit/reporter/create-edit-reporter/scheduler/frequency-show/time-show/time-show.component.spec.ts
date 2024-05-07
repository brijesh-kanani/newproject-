import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeShowComponent } from './time-show.component';

describe('TimeShowComponent', () => {
  let component: TimeShowComponent;
  let fixture: ComponentFixture<TimeShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeShowComponent]
    });
    fixture = TestBed.createComponent(TimeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
