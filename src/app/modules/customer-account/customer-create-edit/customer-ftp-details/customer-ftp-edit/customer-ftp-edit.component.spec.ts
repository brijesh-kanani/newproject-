import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFtpEditComponent } from './customer-ftp-edit.component';

describe('CustomerFtpEditComponent', () => {
  let component: CustomerFtpEditComponent;
  let fixture: ComponentFixture<CustomerFtpEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerFtpEditComponent]
    });
    fixture = TestBed.createComponent(CustomerFtpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
