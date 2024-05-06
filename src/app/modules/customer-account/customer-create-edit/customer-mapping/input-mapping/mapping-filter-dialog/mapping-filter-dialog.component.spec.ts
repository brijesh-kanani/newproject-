import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingFilterDialogComponent } from './mapping-filter-dialog.component';

describe('MappingFilterDialogComponent', () => {
  let component: MappingFilterDialogComponent;
  let fixture: ComponentFixture<MappingFilterDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MappingFilterDialogComponent]
    });
    fixture = TestBed.createComponent(MappingFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
