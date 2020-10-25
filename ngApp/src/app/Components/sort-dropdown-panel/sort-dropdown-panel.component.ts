import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-sort-dropdown-panel',
  templateUrl: './sort-dropdown-panel.component.html',
  styleUrls: ['./sort-dropdown-panel.component.scss']
})
export class SortDropdownPanelComponent implements OnInit {

  sortAvailableItems = [];

  constructor(public service: AppService) { }

  ngOnInit() {
    this.sortAvailableItems = this.service.listPersonItems;
  }

	closeSortComponent() {
		this.service.sort_setting.isShow = false;
	}  

}
