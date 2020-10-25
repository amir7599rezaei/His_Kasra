import { Component, OnInit,ViewChild } from '@angular/core';

import { AppService } from '../../app.service';

@Component({
	selector: 'app-department-control',
	templateUrl: './department-control.component.html',
	styleUrls: ['./department-control.component.scss']
})
export class DepartmentControlComponent implements OnInit {

	public deptListItems: Array<string> = [];
	public department_model;

	public autoLoading = false;

	@ViewChild("list") list;

	constructor(public service: AppService) {

	}

	ngOnInit() {
		//this.deptListItems = this.service.departmentList;
	}

	public filterChange(filter: any): void {
		this.service.getDepartmentDetails(filter, this.service.inputParams.MenuItemId, this.service.inputParams.OnlineUserId);
	}

	public valueChange(value: any): void {
		if( value.length > 1 ){
			this.service.multiselectDepartmentModel = [];
			this.service.multiselectDepartmentModel.push(value[0]);
		}
	}

}
