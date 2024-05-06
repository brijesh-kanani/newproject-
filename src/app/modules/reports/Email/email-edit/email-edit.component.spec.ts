import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailEditComponent } from './email-edit.component';


describe('EmailEditComponent', () => {
  let component: EmailEditComponent;
  let fixture: ComponentFixture<EmailEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailEditComponent]
    });
    fixture = TestBed.createComponent(EmailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
