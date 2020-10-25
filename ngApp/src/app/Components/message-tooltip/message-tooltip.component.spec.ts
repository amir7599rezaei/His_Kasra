import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTooltipComponent } from './message-tooltip.component';

describe('MessageTooltipComponent', () => {
  let component: MessageTooltipComponent;
  let fixture: ComponentFixture<MessageTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
