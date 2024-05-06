import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountFilterComponent } from './account-filter.component';

describe('AccountFilterComponent', () => {
  let component: AccountFilterComponent;
  let fixture: ComponentFixture<AccountFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountFilterComponent]
    });
    fixture = TestBed.createComponent(AccountFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
