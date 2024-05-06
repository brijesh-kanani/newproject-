import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatchAddEditComponent } from './batches-add-edit.component';


describe('BatchAddEditComponent', () => {
  let component: BatchAddEditComponent;
  let fixture: ComponentFixture<BatchAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BatchAddEditComponent]
    });
    fixture = TestBed.createComponent(BatchAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
