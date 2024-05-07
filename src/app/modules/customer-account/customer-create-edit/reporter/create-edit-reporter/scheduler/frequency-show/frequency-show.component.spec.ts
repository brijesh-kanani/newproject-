import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyShowComponent } from './frequency-show.component';

describe('FrequencyShowComponent', () => {
  let component: FrequencyShowComponent;
  let fixture: ComponentFixture<FrequencyShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrequencyShowComponent]
    });
    fixture = TestBed.createComponent(FrequencyShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
