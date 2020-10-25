import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayComponentComponent } from './day-component.component';

describe('DayComponentComponent', () => {
  let component: DayComponentComponent;
  let fixture: ComponentFixture<DayComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
