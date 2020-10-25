import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentControlComponent } from './department-control.component';

describe('DepartmentControlComponent', () => {
  let component: DepartmentControlComponent;
  let fixture: ComponentFixture<DepartmentControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
