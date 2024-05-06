import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreateEditComponent } from './customer-create-edit.component';

describe('CustomerCreateEditComponent', () => {
  let component: CustomerCreateEditComponent;
  let fixture: ComponentFixture<CustomerCreateEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCreateEditComponent]
    });
    fixture = TestBed.createComponent(CustomerCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
