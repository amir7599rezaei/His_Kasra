import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortDropdownPanelComponent } from './sort-dropdown-panel.component';

describe('SortDropdownPanelComponent', () => {
  let component: SortDropdownPanelComponent;
  let fixture: ComponentFixture<SortDropdownPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortDropdownPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortDropdownPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
