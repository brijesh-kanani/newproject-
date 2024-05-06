import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileLogFilterComponent } from './file-log-filter.component';

describe('FileLogFilterComponent', () => {
  let component: FileLogFilterComponent;
  let fixture: ComponentFixture<FileLogFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileLogFilterComponent]
    });
    fixture = TestBed.createComponent(FileLogFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
