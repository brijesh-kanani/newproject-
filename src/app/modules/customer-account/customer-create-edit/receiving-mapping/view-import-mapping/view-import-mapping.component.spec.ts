import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImportMappingComponent } from './view-import-mapping.component';

describe('ViewImportMappingComponent', () => {
  let component: ViewImportMappingComponent;
  let fixture: ComponentFixture<ViewImportMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewImportMappingComponent]
    });
    fixture = TestBed.createComponent(ViewImportMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
