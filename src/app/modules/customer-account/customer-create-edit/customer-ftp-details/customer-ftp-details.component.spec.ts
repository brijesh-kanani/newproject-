import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFtpDetailsComponent } from './customer-ftp-details.component';

describe('CustomerFtpDetailsComponent', () => {
  let component: CustomerFtpDetailsComponent;
  let fixture: ComponentFixture<CustomerFtpDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerFtpDetailsComponent]
    });
    fixture = TestBed.createComponent(CustomerFtpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
