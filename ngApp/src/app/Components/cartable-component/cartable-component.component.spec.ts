import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartableComponentComponent } from './cartable-component.component';

describe('CartableComponentComponent', () => {
  let component: CartableComponentComponent;
  let fixture: ComponentFixture<CartableComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartableComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
