import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMappingComponent } from './input-mapping.component';

describe('InputMappingComponent', () => {
  let component: InputMappingComponent;
  let fixture: ComponentFixture<InputMappingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputMappingComponent]
    });
    fixture = TestBed.createComponent(InputMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
