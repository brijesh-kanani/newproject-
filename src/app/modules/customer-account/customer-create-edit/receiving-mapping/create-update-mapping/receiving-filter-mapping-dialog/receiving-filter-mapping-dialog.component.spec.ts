import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingFilterMappingDialogComponent } from './receiving-filter-mapping-dialog.component';

describe('ReceivingFilterMappingDialogComponent', () => {
  let component: ReceivingFilterMappingDialogComponent;
  let fixture: ComponentFixture<ReceivingFilterMappingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivingFilterMappingDialogComponent]
    });
    fixture = TestBed.createComponent(ReceivingFilterMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
