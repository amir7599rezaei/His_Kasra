import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import * as moment from 'jalali-moment';
import { ServerService } from '../../server.service';
import { GlobalPopupService } from '../../Services/global-popup.service';
import { CartableService } from '../../Services/cartable.service';

@Component({
	selector: 'app-cartable-component',
	templateUrl: './cartable-component.component.html',
	styleUrls: ['./cartable-component.component.scss']
})

export class CartableComponentComponent implements OnInit {
	dateObject = "";
	showFilterBox: boolean;
	constructor(
		public service: AppService, 
		public server: ServerService, 
		public globalPopupService: GlobalPopupService,
		public cartableService:CartableService) {
		this.showFilterBox = false;
	}

	ngOnInit() {
		// this.service.getPersonDetails('filter', this.service.inputParams.MenuItemId);    
		this.service.getDocumentType_LComboListData();
	}

	showCartableBox() {
		this.service.showCartableBox= ! this.service.showCartableBox;
	}

	public filterChange(filter: any): void {
		this.service.getPersonDetails(filter, 1306);
	}

	public valueChange(value: any): void {
		var obj = this.service.listPersonData.find(x => x.Name === value);
		this.service.cartableVariable.person = obj;
	}

	showFilterBoxFn() {
		this.showFilterBox = !this.showFilterBox;
	}

	goNextPage() {
		if (this.service.paginateCartable.paginate + 1 < this.service.paginateCartable.total) {
			this.service.paginateCartable.paginate += 1;
		}
	}

	goPrevPage() {
		if (this.service.paginateCartable.paginate + 1 > 1) {
			this.service.paginateCartable.paginate -= 1;
		}
	}

	showCartableChangesOnClick(isShowFiltered: boolean = false) {
		this.cartableService.isShowCartableChanges = true;
		this.cartableService.isShowfilteredCartableChanges = isShowFiltered;

		this.cartableService.createCartableStructureList();
	}

	openModalWorkFlow(cartable) {
		var options = {
			title: "نمایش روند",
			width: "1024px",
			height: "768px",
			use_iframe: true,
			pageurl: "/FrmPresentation/App_Pages/BaseInfo/WorkFlow/DocFlow.aspx?DocTypeID=" + cartable.DocTypeID + "&DocID=" + cartable.DocID,
			rtl: true,
			has_toolbar: false,
			methodCall: "Get"
		}
		this.service.SchedulingProg['call_modal'](options);
	}

	filterCartableList() {
		// console.log('SchedulingProgDetailList', this.service.SchedulingProgDetailList)
		// console.log('service.cartableVariable', this.service.cartableVariable)
		// console.log('listCartable_Orginal', this.service.listCartable_Orginal);

		var filterList = [];

		this.service.listCartable_Orginal.forEach(cartable => {
			var addtoList = true;
			// ************* Check Person *************
			if (this.service.cartableVariable.person != undefined) {
				if (cartable.DocMemberID == this.service.cartableVariable.person.Id) {
					// console.log('true name', addtoList)
				} else {
					addtoList = false;
				}
			}

			// ************* Check Doctype *************
			if (this.service.cartableVariable.documentType != undefined && this.service.cartableVariable.documentType != 0 && this.service.cartableVariable.documentType != "") {
				if (cartable.DocTypeID == parseInt(this.service.cartableVariable.documentType)) {
					// console.log('true doc', addtoList)
				} else {
					addtoList = false;
				}
			}

			// ************* Check StartDate *************
			if (this.service.cartableVariable.startDate != undefined) {
				var startDate = moment.from(this.service.cartableVariable.startDate, 'fa', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')

				if (cartable.SDate >= startDate) {
					// console.log('true SDate', addtoList)
				} else {
					addtoList = false;
				}
			}

			// ************* Check EndDate *************
			if (this.service.cartableVariable.endDate != undefined) {
				var endDate = moment.from(this.service.cartableVariable.endDate, 'fa', 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD')

				if (cartable.EDate <= endDate) {
					// console.log('true EDate', addtoList)
				} else {
					addtoList = false;
				}
			}

			if (addtoList) {
				filterList.push(cartable);
			}
		});

		// console.log('filterList',filterList);
		this.service.listCartable = filterList;
	}

	cancelCartableItem(cartable) {
		console.log('cartable :', cartable);
		var sendobject = {
			SchedulingProgDetailHead: {
				WPID: this.service.ReplaceShiftWP_model,
				ID: 0,
				Confirm: 0,
				onlineUserId: this.service.inputParams.OnlineUserId
			},
			SchedulingProgDetailCartable: [],
			SchedulingProgDetailCartableSetting: {
				ActionType: 'Cancel',
			}
		}
		sendobject.SchedulingProgDetailCartable.push(cartable);

		this.server.ModifyCartable(sendobject).subscribe(data => {
			var result = JSON.parse(JSON.parse(data));
			console.log('data : ', result);

			if (result.Success === 1) {
				// Success
				this.globalPopupService.toast(result['Message'], 'success');
				this.service.getCartableList();
			} else if (result.Success === 0) {
				// Failed
				this.globalPopupService.toast(result['Message'], 'error');
			}
		});
	}

	cancelAll() {
		var sendobject = {
			SchedulingProgDetailHead: {
				WPID: this.service.ReplaceShiftWP_model,
				ID: 0,
				Confirm: 0,
				onlineUserId: this.service.inputParams.OnlineUserId
			},
			SchedulingProgDetailCartable: this.service.listCartable,
			SchedulingProgDetailCartableSetting: {
				ActionType: 'Cancel',
			}
		}

		this.server.ModifyCartable(sendobject).subscribe(data => {
			var result = JSON.parse(JSON.parse(data));
			console.log('data : ', result);

			if (result.Success === 1) {
				// Success
				this.globalPopupService.toast(result['Message'], 'success');
				this.service.getCartableList();
			} else if (result.Success === 0) {
				// Failed
				this.globalPopupService.toast(result['Message'], 'error');
			}
		});
	}

	confirmAll() {
		var sendobject = {
			SchedulingProgDetailHead: {
				WPID: this.service.ReplaceShiftWP_model,
				ID: 0,
				Confirm: 0,
				onlineUserId: this.service.inputParams.OnlineUserId
			},
			SchedulingProgDetailCartable: this.service.listCartable,
			SchedulingProgDetailCartableSetting: {
				ActionType: 'Confirm',
			}
		}

		this.server.ModifyCartable(sendobject).subscribe(data => {
			var result = JSON.parse(JSON.parse(data));
			console.log('data : ', result);

			if (result.Success === 1) {
				// Success
				this.globalPopupService.toast(result['Message'], 'success');
				this.service.getCartableList();
			} else if (result.Success === 0) {
				// Failed
				this.globalPopupService.toast(result['Message'], 'error');
			}
		});
	}
}
