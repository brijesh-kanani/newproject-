import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingMappingSaveDilaogComponent } from './receiving-mapping-save-dilaog.component';

describe('ReceivingMappingSaveDilaogComponent', () => {
  let component: ReceivingMappingSaveDilaogComponent;
  let fixture: ComponentFixture<ReceivingMappingSaveDilaogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceivingMappingSaveDilaogComponent]
    });
    fixture = TestBed.createComponent(ReceivingMappingSaveDilaogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
