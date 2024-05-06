import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleMappingDialogComponent } from './multiple-mapping-dialog.component';

describe('MultipleMappingDialogComponent', () => {
  let component: MultipleMappingDialogComponent;
  let fixture: ComponentFixture<MultipleMappingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultipleMappingDialogComponent]
    });
    fixture = TestBed.createComponent(MultipleMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
