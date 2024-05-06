import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTamplateComponent } from './save-tamplate.component';

describe('SaveTamplateComponent', () => {
  let component: SaveTamplateComponent;
  let fixture: ComponentFixture<SaveTamplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveTamplateComponent]
    });
    fixture = TestBed.createComponent(SaveTamplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
