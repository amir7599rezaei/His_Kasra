import { Component, OnInit, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';

import { AppService } from './app.service';
import { Structure } from './Models/Structure';
import { StructureService } from './Services/structure.service';
import { DialogService } from "./Services/dialog.service";
import { GlobalPopupService } from "./Services/global-popup.service";
import { CartableService } from "./Services/cartable.service";
import { SpecialItem } from './Models/special-item';

import * as moment from 'jalali-moment';
//import * as $ from 'jquery';
declare var SchedulingProg: object;

@Component({
	selector: 'app-schedulingprog',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit {

	constructor(
		public service: AppService,
		public elementRef: ElementRef,
		public ChangeDetector: ChangeDetectorRef,
		public structureService: StructureService,
		public dialogService: DialogService,
		public globalPopupService: GlobalPopupService,
		public cartableService:CartableService) {
		this.service.inputParams = JSON.parse(this.elementRef.nativeElement.getAttribute('InputParams').replace(/'/g, '"'));
		this.service.Dictionary = JSON.parse(this.elementRef.nativeElement.getAttribute('Dictionary').replace(/'/g, '"'));
		this.service.Permisions = JSON.parse(this.elementRef.nativeElement.getAttribute('Permisions').replace(/'/g, '"'));

		if (this.service.inputParams.DepartmentID != 0 && this.service.inputParams.DepartmentName != "") {
			this.service.multiselectDepartmentModel = [
				{
					"Id": this.service.inputParams.DepartmentID,
					"Name": this.service.inputParams.DepartmentName
				}
			]
		}

		this.globalPopupService.localNamespaceObject = (typeof SchedulingProg != "undefined") ? SchedulingProg : null;

		this.service.ChangeDetector = ChangeDetector;

		this.service.setApiUrl(this.service.inputParams.apiUrl.lego, this.service.inputParams.apiUrl.his);
	}

	ngOnInit() {
		this.globalPopupService.preloader("show");

		this.service.dataPersonelFields$.subscribe(data => {
			if (this.service.multiselectDepartmentModel.length != 0) {
				if (this.service.multiselectDepartmentModel[0].Id != 0) {
					this.service.getSchedulingProgDetail(this.service.multiselectDepartmentModel[0].Id, this.service.ReplaceShiftWP_model, this.service.ShiftVersions_model, 'test', 1, this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId);
				}
			} else {
				this.globalPopupService.preloader("hide");
			}

			this.structureService.getStructureList(this.service.multiselectDepartmentModel[0].Id, this.service.ReplaceShiftWP_model, this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId);
			this.structureService.getToolbarStructurList(this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId, this.service.ReplaceShiftWP_model);
			this.structureService.getSpecialItemsList(this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId);
		});

		this.service.dataLoaded$.subscribe(data => {
			this.globalPopupService.preloader("hide");

			this.resetBodyScroll();

			this.elementRef.nativeElement.querySelector('.app-body .body-ps .ps').addEventListener("scroll", e => {
				this.onPsScrollX(e);
			});
		});

		this.service.dataSave$.subscribe(data => {
			// Show Notification To User
			this.globalPopupService.preloader("hide");
			if (data['Success'] === true) {
				// Success
				this.globalPopupService.toast(data['Message'], 'success');
			} else if (data['Success'] === false) {
				// Failed
				this.globalPopupService.toast(data['Message'], 'error');
			}
		});

		this.service.get_ReplaceShiftWP_LComboListData();

		this.service.getPersonelFields(this.service.inputParams.MenuItemId, this.service.inputParams.OnlineUserId);
	}

	onFilterBtn() {
		debugger;
		this.globalPopupService.preloader("show");
		if (this.service.multiselectDepartmentModel.length != 0) {
			if (this.service.multiselectDepartmentModel[0].Id != 0) {
				this.service.getSchedulingProgDetail(this.service.multiselectDepartmentModel[0].Id, this.service.ReplaceShiftWP_model, this.service.ShiftVersions_model, 'test', 1, this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId);
			}
		} else {
			this.globalPopupService.preloader("hide");
		}

		this.cartableService.isShowCartableChanges = false;
		this.cartableService.isShowfilteredCartableChanges = false;
		this.structureService.getStructureList(this.service.multiselectDepartmentModel[0].Id, this.service.ReplaceShiftWP_model, this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId);
		this.structureService.getToolbarStructurList(this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId, this.service.ReplaceShiftWP_model);
		//this.structureService.getSpecialItemsList(this.service.inputParams.MenuItemId, this.service.inputParams.SystemId, this.service.inputParams.OnlineUserId);
	}

	onPsScrollX(event: any) {
		var scrollWidth = event.target.scrollWidth;
		var offsetWidth = event.target.offsetWidth;
		var scrollLeft = event.target.scrollLeft;
		this.elementRef.nativeElement.querySelector('.footer-top .scrollable').scrollLeft = scrollLeft;
		this.elementRef.nativeElement.querySelector('.app-header .scrollable').scrollLeft = scrollLeft;
		this.elementRef.nativeElement.querySelector('.app-body .fixed')
			.setAttribute("style", "right:" + (- scrollLeft) + "px");
	}

	resetBodyScroll() {
		/*var scrollbody: HTMLElement = this.elementRef.nativeElement.querySelector('.app-body .body-ps .ps');
		if (scrollbody) {
			scrollbody.scrollLeft = scrollbody.scrollWidth - scrollbody.offsetWidth;
			this.elementRef.nativeElement.querySelector('.footer-top .scrollable').scrollLeft = scrollbody.scrollLeft;
			this.elementRef.nativeElement.querySelector('.app-header .scrollable').scrollLeft = scrollbody.scrollLeft;
		}*/
	}

	ToolbarStructure_onClick(str: Structure) {
		if (str) {
			str.enable = !str.enable;
		}
	}

	Structure_onClick(str: Structure) {
		if (str) {
			//str.enable = !str.enable;
			if (!str.enable) {

				var enabledStr = this.structureService.subStructureList.filter(sStr => {
					return sStr.CategoryStructureID == str.CategoryStructureID && sStr.enable == true
				})

				if (enabledStr.length > 0) {
					enabledStr[0].enable = false;
				}
			}

			str.enable = !str.enable

		}
	}

	StructureSelectBtn_onClick() {
		var chkValidation: any = this.structureService.check_validation(this.service.Selected_day);
		if (chkValidation.success) {
			this.dialogService.close("structureOfDepartment");
			var enabledSpi = this.structureService.getEnabledSpecialItems();

			if (enabledSpi.length > 0) {
				this.structureService.addSpecialItem(this.service.Selected_day);
			}

			this.structureService.addStructure(this.service.Selected_day);
		} else {
			this.globalPopupService.toast(chkValidation.message, "error");
		}
	}

	SpecialItems_onClick(specialItem: any) {
		if (specialItem) {
			var enabledSpi = this.structureService.getEnabledSpecialItems();
			if (enabledSpi.length > 0) {
				if (enabledSpi[0].Id == specialItem.Id) {
					enabledSpi[0].enable = false;
				} else {
					enabledSpi[0].enable = !enabledSpi[0].enable;
					specialItem.enable = !specialItem.enable;
				}
			} else {
				specialItem.enable = !specialItem.enable;
			}
		}
	}

	DayComponent_onClick(day: any, person: any) {
		if (event.target) {
			var elem: HTMLElement = event.target as HTMLElement;
			//doesn't continue if on close btn clicked
			if (elem.classList.contains("str-close-btn")) {
				return;
			}
		}

		if (this.service.chooseCellMode) {
			return;
		}

		if (day.DayStyle != "") {
			//doesn't continue if day have Credit!
			this.globalPopupService.toast('برای این روز نمیتوانید ساختار بچینید.', 'error');
			return;
		}

		if (this.service.registerCreditMode) {
			this.service.registerCreditMode = false;
			this.openModalRegisterCredit(person, day);
			return;
		}

		this.service.Selected_day = day;
		debugger;
		//چک بمنظور اینکه ساختاری انتخاب شده است یا نه
		if (this.structureService.getEnabledToolbarStructures().length > 0) {
			this.structureService.createStructureList(person.PersonID, (resultList: any) => {
				//چک بمنظور اینکه آیا زیر ساختاری وجود دارد یا نه؟
				if (resultList.length > 0) {
					this.dialogService.open("structureOfDepartment");
				} else {
					this.globalPopupService.toast('زیر ساختاری برای این روز یافت نشد.', 'error');
				}
			});
		}
	}

	onSaveBtn(Confirm: Number = 0) {
		this.service.modifySchedulingProgDetail({
			SchedulingProgDetailList: this.service.SchedulingProgDetailList,
			SchedulingProgDetailHead: {
				WPID: this.service.ReplaceShiftWP_model,
				ID: this.service.multiselectDepartmentModel[0].Id,
				Confirm: Confirm,
				onlineUserId: this.service.inputParams.OnlineUserId
			},
			SchedulingProgDetailCartable: this.service.listCartable
		});
	}

	onFinalBtn() {
		var notifier_option = {
			vertical_align: "center",
			rtl: true,
			has_icon: false,
			btns: [
				{
					label: "بلی",
					type: "success",
					onClick: () => {
						this.onSaveBtn(1);
					}
				},
				{
					label: "خیر",
					type: "default",
					onClick: () => {
						//debugger
					}
				}
			],
			callback: () => {
				//debugger
			}
		}

		this.globalPopupService.notifier("در صورت نهايي کردن برنامه، دیگر امکان تغییر وجود ندارد. آيا مطمئن هستيد؟", "success", notifier_option);
	}

	onAcceptBtn() {
		this.onSaveBtn(1);
	}

	openSortComponent() {
		this.service.sort_setting.isShow = true;
	}

	toggleSortComponent() {
		this.service.sort_setting.isShow = !this.service.sort_setting.isShow;
	}

	closeSortComponent() {
		this.service.sort_setting.isShow = false;
	}

	// saveMessageSelectedCell() {
	// 	this.service.SchedulingProg['call_preloader']('show');
	// 	this.service.submitNewMesage();
	// }

	focusComponent(day, person) {
		if (this.service.chooseCellMode) {
			// ******* [Message On Selected Day] *******
			if ((day.DayNo != undefined) && (person.PersonID != undefined)) {
				this.service.messageSelectedCell.type = 'day';
				this.service.messageSelectedCell.day = day;
				this.service.messageSelectedCell.person = person;

				if (this.service.chooseCellMode) {
					this.service.showAddNewMsgComponent = true;
					setTimeout(() => {
						this.service.chooseCellMode = false;
					}, 20);
				}
			}

			// ******* [Message On Selected Person] *******
			if ((day.DayNo == undefined) && (person.PersonID != undefined)) {
				this.service.messageSelectedCell.type = 'person';
				this.service.messageSelectedCell.day = {};
				this.service.messageSelectedCell.person = person;

				if (this.service.chooseCellMode) {
					this.service.showAddNewMsgComponent = true;
					setTimeout(() => {
						this.service.chooseCellMode = false;
					}, 20);
				}
			}

			// ******* [Message On Selected Column] *******
			if ((day.DayNo != undefined) && (person.PersonID == undefined)) {
				this.service.messageSelectedCell.type = 'column';
				this.service.messageSelectedCell.day = day;
				this.service.messageSelectedCell.person = {};

				this.service.showAddNewMsgComponent = true;
				setTimeout(() => {
					this.service.chooseCellMode = false;
				}, 20);
			}


		}
	}

	openFilterComponent() {
		// this.service.showSortComponent = false;
		this.service.showMessageComponent = false;
		this.service.showFilterComponent = !this.service.showFilterComponent;
	}

	// Register Credit
	onRegisterCreditBtn() {
		this.service.registerCreditMode = true;
		this.openModalRegisterCredit();
	}

	openModalRegisterCredit(person: any = null, day: any = null) {
		var ajaxData = {};
		debugger;

		if (person && day) {
			ajaxData = {
				id: person.PersonID,
				personName: person.PersonName,
				startDate: moment.from(day.Date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD')
			}
		}

		var options = {
			title: "ثبت مجوز",
			width: "600px",
			height: "500px",
			pageurl: "RegisterCredit/Show",
			ajaxData: ajaxData,
			rtl: true,
			has_toolbar: true,
			methodCall: "POST",
			body_template: `
			<div><button class="btnkasra btn-default" data-dismiss="kasra-modal-dialog" data-return-value="selectCell">انتخاب سلول</button></div>
			<div class="content"></div>`,
			callback_func: (data: any) => {
				if (data == "selectCell") {
					this.service.registerCreditMode = true;
				} else if (data == "close") {
					this.service.registerCreditMode = false;
				} else if (typeof (data) == "object") {
					//this.modifyRegisterCredit(data);
				}
			}
		}
		this.globalPopupService.modal(options);
	}

	modifyRegisterCredit(data) {
		// data = '{"StartDate":"۱۳۹۷/۰۵/۰۲","EndDate":"۱۳۹۷/۰۵/۰۲","CreditType":1,"StartTime":"13:05","EndTime":"23:50","Daily":2,"Des":"teat","CodeID":"11053","RowIndex":0,"JPersonelID":"","MID":"770403","MType":"U","Extended":"","SerialNo":""}'

		// data='{"StartDate":"۱۳۹۷/۰۵/۰۶","EndDate":"۱۳۹۷/۰۵/۱۱","CreditType":1,"StartTime":"","EndTime":"","Daily":1,"Des":"","CodeID":"11054","RowIndex":0,"JPersonelID":"","MID":"770403","MType":"U","Extended":"","SerialNo":""}'
		// data = JSON.parse(data)
debugger;
		var
			persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
			englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g],
			fixNumbers = function (str) {
				if (typeof str === 'string') {
					for (var i = 0; i < 10; i++) {
						str = str.replace(persianNumbers[i], i).replace(englishNumbers[i], i);
					}
				}
				return str;
			};

		if (data != false) {
			data.StartDate = fixNumbers(data.StartDate);
			data.EndDate = fixNumbers(data.EndDate);
			console.log('data', data);

			if (data.Daily == 1) {
				// Daily
				this.service.SchedulingProgDetailList.forEach(schedulingItem => {

					if (schedulingItem.PersonInfo.PersonID == parseInt(data.MID)) {
						this.service.SchedulingProgDetailList_header.forEach(day => {
							if ((day.Date >= data.StartDate) && (day.Date <= data.EndDate)) {
								day.DayStyle = "DailyCredit";
								console.log('done');
							}
						});
						this.ChangeDetector.detectChanges();
					};
				});

			} else if (data.Daily == 2) {
				// Hourly
				this.service.SchedulingProgDetailList.forEach(schedulingItem => {

					if (schedulingItem.PersonInfo.PersonID == parseInt(data.MID)) {
						this.service.SchedulingProgDetailList_header.forEach(day => {
							if (day.Date == data.StartDate) {
								day.DayStyle = "HourlyCredit";
								console.log('done');
								this.ChangeDetector.detectChanges();
							}
						});
					};
				});
			}

		}
	}

	@HostListener('click')
	onMouseClick() {
		// console.log('event.srcElement', event.srcElement);

		const string = (event.srcElement as HTMLElement).outerHTML;
		if (this.service.showMessageComponent) {
			if (string.includes('name="message-dropdown-wrapper"')) {
				this.service.showMessageComponent = true;
			} else {
				this.service.showMessageComponent = false;
				this.service.showConfirmComponent = {
					show: false,
					msg: {},
				};
			}
		}

		if (this.service.showAddNewMsgComponent) {
			if (string.includes('name="add-new-message-modal"')) {
				this.service.showAddNewMsgComponent = true;
			} else {
				if (!this.service.chooseCellMode) {
					this.service.showAddNewMsgComponent = false;
				}
			}
		}

		// if (this.service.showSortComponent) {
		// 	if ((string.includes('name="sort-dropdown-component"')) || (string.includes('name="sortTypeDropdown"')) || (string.includes('name="sortNameDropdown"'))) {
		// 		this.service.showSortComponent = true;
		// 	} else {
		// 		this.service.showSortComponent = false;
		// 	}
		// }

		if (this.service.showFilterComponent) {
			if (string.includes('name="filter-dropdown-component"')) {
				this.service.showFilterComponent = true;
			} else {
				this.service.showFilterComponent = false;
			}
		}

		// if (this.service.showPersonnelSettingComponent) {
		// 	if (string.includes('name="personnel-setting-modal"')) {
		// 		this.service.showPersonnelSettingComponent = true;
		// 	} else {
		// 		this.service.showPersonnelSettingComponent = false;
		// 	}
		// }

		if (this.service.showCartableBox) {
			if (string.includes('name="cartable-component"')) {
				this.service.showCartableBox = true;
			} else {
				if (!string.includes('dp-picker-input') && !string.includes('dp-calendar') && !string.includes('placeholder="پرسنل"') && !string.includes('dp-current-location') && !string.includes('dp-nav')) {
					this.service.showCartableBox = false;
				}
			}
		}
	}
}
