import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFileLogComponent } from './dashboard-file-log.component';

describe('DashboardFileLogComponent', () => {
  let component: DashboardFileLogComponent;
  let fixture: ComponentFixture<DashboardFileLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardFileLogComponent]
    });
    fixture = TestBed.createComponent(DashboardFileLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
