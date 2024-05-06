import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMappingDialogComponent } from './view-mapping-dialog.component';

describe('ViewMappingDialogComponent', () => {
  let component: ViewMappingDialogComponent;
  let fixture: ComponentFixture<ViewMappingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMappingDialogComponent]
    });
    fixture = TestBed.createComponent(ViewMappingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
