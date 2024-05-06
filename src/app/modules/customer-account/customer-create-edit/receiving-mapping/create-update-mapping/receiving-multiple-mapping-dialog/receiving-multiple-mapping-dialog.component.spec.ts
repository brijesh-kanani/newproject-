import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingMultipleMappingDialogComponent } from './receiving-multiple-mapping-dialog.component';

describe('ReceivingMultipleMappingDialogComponent', () => {
  let component: ReceivingMultipleMappingDialogComponent;
  let fixture: ComponentFixture<ReceivingMultipleMappingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivingMultipleMappingDialogComponent]
    });
    fixture = TestBed.createComponent(ReceivingMultipleMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
