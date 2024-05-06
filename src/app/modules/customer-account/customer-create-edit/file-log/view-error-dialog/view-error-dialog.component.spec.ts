import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewErrorDialogComponent } from './view-error-dialog.component';

describe('ViewErrorDialogComponent', () => {
  let component: ViewErrorDialogComponent;
  let fixture: ComponentFixture<ViewErrorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewErrorDialogComponent]
    });
    fixture = TestBed.createComponent(ViewErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
