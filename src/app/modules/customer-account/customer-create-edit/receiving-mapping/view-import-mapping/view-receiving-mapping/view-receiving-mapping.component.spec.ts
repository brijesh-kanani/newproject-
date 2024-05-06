import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceivingMappingComponent } from './view-receiving-mapping.component';

describe('ViewReceivingMappingComponent', () => {
  let component: ViewReceivingMappingComponent;
  let fixture: ComponentFixture<ViewReceivingMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewReceivingMappingComponent]
    });
    fixture = TestBed.createComponent(ViewReceivingMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
