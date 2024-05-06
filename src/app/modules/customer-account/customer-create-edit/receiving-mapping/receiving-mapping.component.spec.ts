import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingMappingComponent } from './receiving-mapping.component';

describe('ReceivingMappingComponent', () => {
  let component: ReceivingMappingComponent;
  let fixture: ComponentFixture<ReceivingMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivingMappingComponent]
    });
    fixture = TestBed.createComponent(ReceivingMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
