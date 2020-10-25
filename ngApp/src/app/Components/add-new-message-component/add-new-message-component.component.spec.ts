import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMessageComponent } from './add-new-message-component.component';

describe('AddNewMessageComponent', () => {
  let component: AddNewMessageComponent;
  let fixture: ComponentFixture<AddNewMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
