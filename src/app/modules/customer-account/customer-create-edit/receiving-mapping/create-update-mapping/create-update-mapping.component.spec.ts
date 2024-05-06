import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateMappingComponent } from './create-update-mapping.component';

describe('CreateUpdateMappingComponent', () => {
  let component: CreateUpdateMappingComponent;
  let fixture: ComponentFixture<CreateUpdateMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateMappingComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
