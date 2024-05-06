import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAccountFilterComponent } from './customer-account-filter.component';

describe('CustomerAccountFilterComponent', () => {
  let component: CustomerAccountFilterComponent;
  let fixture: ComponentFixture<CustomerAccountFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerAccountFilterComponent]
    });
    fixture = TestBed.createComponent(CustomerAccountFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
