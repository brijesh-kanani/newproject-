import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseNoteComponent } from './release-note.component';

describe('ReleaseNoteComponent', () => {
  let component: ReleaseNoteComponent;
  let fixture: ComponentFixture<ReleaseNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseNoteComponent]
    });
    fixture = TestBed.createComponent(ReleaseNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
