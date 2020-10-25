import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComponentsComponent } from './confirm-components.component';

describe('ConfirmComponentsComponent', () => {
  let component: ConfirmComponentsComponent;
  let fixture: ComponentFixture<ConfirmComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
