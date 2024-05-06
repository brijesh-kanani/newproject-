import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFtpDialogComponent } from './create-ftp-dialog.component';

describe('CreateFtpDialogComponent', () => {
  let component: CreateFtpDialogComponent;
  let fixture: ComponentFixture<CreateFtpDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateFtpDialogComponent]
    });
    fixture = TestBed.createComponent(CreateFtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
