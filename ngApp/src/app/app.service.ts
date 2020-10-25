import { Injectable, ChangeDetectorRef } from '@angular/core';
import { ServerService } from './server.service';
import { GlobalPopupService } from "./Services/global-popup.service";
import { Structure } from './Models/Structure';
import { DayModel } from './Models/Day';

import { Subject } from 'rxjs';
import { SpecialItem } from './Models/special-item';
//import { element } from '@angular/core/src/render3/instructions';

@Injectable()

export class AppService {

	public inputParams: any;
	public Dictionary: any;
	public Permisions: any;


	public Selected_day: any = new DayModel();

	public SchedulingProg: object;

	public ChangeDetector: ChangeDetectorRef;

	//events
	private dataLoadSource = new Subject();
	public dataLoaded$ = this.dataLoadSource.asObservable();

	private dataSave = new Subject();
	public dataSave$ = this.dataSave.asObservable();

	private dataPersonelFields = new Subject();
	public dataPersonelFields$ = this.dataPersonelFields.asObservable();

	private dataSpecialItems = new Subject();
	public dataSpecialItems$ = this.dataSpecialItems.asObservable();

	private dataStructures = new Subject();
	public dataStructures$ = this.dataStructures.asObservable();

	private dataMessage = new Subject();
	public dataMessage$ = this.dataMessage.asObservable();

	//structure list
	public structure: Structure[];
	public specialItem: SpecialItem[];
	public specialItemTypes: any[];

	public structureOfDepartmentList: any[];


	//lists
	public SchedulingProgDetailList_orginal = [];
	public SchedulingProgDetailList = [];
	public SchedulingProgDetailList_header = [];

	//department list
	public multiselectDepartmentList = [];
	public multiselectDepartmentModel = [];

	public ShiftVersions_LComboListData: any;
	public ShiftVersions_model: number = 19001;
	public ReplaceShiftWP_LComboListData: any;
	public ReplaceShiftWP_model: number = 75;

	// Cartable 
	public showCartableBox: boolean;
	public listPersonData: any;
	public documentType_LComboListData: any;
	public cartableVariable: any;
	public listCartable: any;
	public listCartable_Orginal: any;
	public paginateCartable: any;
	public registerCreditMode: boolean;

	public personNameSearchModel: string;

	//sort
	public sort_setting;

	//person Items
	public listPersonItems;

	//add New message
	public listNotifyMessage: any;
	public showAddNewMsgComponent: boolean;
	public showConfirmComponent: any;
	public showMessageComponent: boolean;
	public paginateNotifyMessage: any;
	public chooseCellMode: boolean;
	public messageSelectedCell: any;

	// Filter
	public listAvailableFilter: any;
	public showFilterComponent: boolean;
	public activeFilterBtn: boolean;

	//1 نمایش دکمه ذخیره  
	//[1,0,0]
	//2 نمایش دکمه نهایی
	//[0,2,0]
	//3 نمایش دکمه تایید
	//[0,0,3]
	//همگی
	//[1,2,3]
	public showBtnSetting: Array<number> = [0, 0, 0];

	constructor(public server: ServerService, public globalPopupService: GlobalPopupService) {
		this.personNameSearchModel = "";
		//sort
		this.sort_setting = {
			sortItem: '',
			sortType: 'Asc',
			id: null,
			isShow: false
		};

		this.listPersonItems = [];

		// Add New Message
		this.listNotifyMessage = [];
		this.showMessageComponent = false;
		this.showAddNewMsgComponent = false;
		this.showConfirmComponent = false;
		this.showConfirmComponent = {
			show: false,
			msg: {},
		};
		this.chooseCellMode = false;
		this.messageSelectedCell = {
			type: '',
			day: {},
			person: {},
			message: ''
		}
		this.paginateNotifyMessage = {
			limit: 3,
			total: 0,
			paginate: 0
		}

		// filter 
		this.listAvailableFilter = [];
		this.showFilterComponent = false;
		this.activeFilterBtn = false;

		// Cartable
		this.showCartableBox = false;
		this.listPersonData = [];
		this.documentType_LComboListData = [];
		this.cartableVariable = {
			startDate: "",
			endDate: "",
			person: undefined,
			documentType: "",
		}
		this.listCartable_Orginal = [];
		this.listCartable = [];
		this.paginateCartable = {
			limit: 3,
			total: 0,
			paginate: 0
		}
		this.registerCreditMode = false;
	}

	setApiUrl(lego_ApiUrl: string, his_ApiUrl: string) {
		this.server.setApiUrl(lego_ApiUrl, his_ApiUrl);
	}

	getSchedulingProgDetail(DepartmentID: number, WPID: number, Version: number, AccordingTo: string, WeekNumber: number, MenuItemId: number, SystemId: number, OnlineUserId: number) {
		this.SchedulingProgDetailList_orginal = [];
		this.SchedulingProgDetailList = [];
		this.SchedulingProgDetailList_header = [];

		this.listAvailableFilter = [];

		this.server.getSchedulingProgDetail(DepartmentID, WPID, Version, AccordingTo, WeekNumber, MenuItemId, SystemId, OnlineUserId).subscribe(data => {
			console.log(JSON.parse(data));
			this.SchedulingProgDetailList_orginal = JSON.parse(data);
			this.SchedulingProgDetailList = this.SchedulingProgDetailList_orginal;

			this.createFiltersList();
			this.getAllNotifyMessage();
			if (this.Permisions.cartable) {
				this.getCartableList();
			}

			if (this.SchedulingProgDetailList.length > 0) {
				// Call Create Filter List

				//create header list
				this.SchedulingProgDetailList_header = [];

				// Get Show Btn Setting
				if (this.SchedulingProgDetailList[0].Setting.ShowBtn != "") {
					//this.showBtnSetting = this.SchedulingProgDetailList[0].Setting.ShowBtn.split(",");
					this.showBtnSetting = JSON.parse("[" + this.SchedulingProgDetailList[0].Setting.ShowBtn.split(",") + "]");
				}

				for (const key in this.SchedulingProgDetailList[0]['Days']) {
					if (this.SchedulingProgDetailList[0]['Days'].hasOwnProperty(key)) {
						this.SchedulingProgDetailList_header.push(this.SchedulingProgDetailList[0]['Days'][key]);
					}
				}

				this.SchedulingProgDetailList_header.sort(function (a, b) {
					return a.DayNo - b.DayNo;
				});
			}

			this.sortFilterInit();
			this.dataLoadSource.next('hide');
		})
	}

	getPersonelFields(MenuItemId: number, OnlineUserId: number) {
		this.server.getUiSettings(MenuItemId, OnlineUserId).subscribe(data => {
			const receivedData = JSON.parse(data);
			const fields: any = [];
			if (receivedData.length > 0) {
				for (const item of receivedData) {
					fields.push(item);
				}
			}
			this.listPersonItems = fields;

			this.dataPersonelFields.next('isLoadedData');
		});
	}

	sortFilterInit() {
		for (const item of this.listPersonItems) {
			if (item.Sortable && item.HasSort) {
				this.sort_setting.sortItem = item.Name;
				this.sort_setting.sortType = item.SortType;
				this.sort_setting.id = item.Id;
				this.sort();
			}
		}
	}

	// getStructures(menuItemId: number, systemId: number, onlineUserId: number, wpId: number) {
	// 	this.server.getStructures(menuItemId, systemId, onlineUserId, wpId).subscribe(data => {
	// 		const receivedData = JSON.parse(data);
	// 		const items: any = [];
	// 		const keys: any = [];
	// 		const structureList: Structure[] = [];
	// 		if (receivedData.length > 0) {

	// 			receivedData.forEach(element => {
	// 				var group = {} as Structure;
	// 				group.CategoryStructureID = element.CategoryStructureID;
	// 				group.CategoryStructureTitle = element.CategoryStructureTitle;
	// 				group.CategoryStructureAcronym = element.CategoryStructureAcronym;
	// 				group.StructureID = element.StructureID;
	// 				group.StructureTitle = element.StructureTitle;
	// 				group.StructureAcronym = element.StructureAcronym;
	// 				group.Karkard = element.Karkard;
	// 				group.enable = false;
	// 				structureList.push(group);
	// 			});
	// 		}

	// 		this.structure = structureList;// items;

	// 		this.dataStructures.next('isLoadedData');
	// 	});
	// }

	getSpecialItems(menuItemId: number, systemId: number, onlineUserId: number) {
		// this.specialItem = [
		// 	{ Id: 14182, Title: 'O', Time: "", Acronym: "O", Date: "", CategoryId: 83, CategoryTitle: 'O', Enable: false },
		// 	{ Id: 23, Title: 'H', Time: "", Acronym: "SPI_Head", Date: "", CategoryId: 85, CategoryTitle: 'H', Enable: false },
		// 	{ Id: 24, Title: 'D', Time: "", Acronym: "SPI_Drug", Date: "", CategoryId: 84, CategoryTitle: 'D', Enable: false }
		// ]

		this.server.getSpecialItems(menuItemId, systemId, onlineUserId).subscribe(data => {
			const receivedData = JSON.parse(data);
			const items: any = [];
			if (receivedData.length > 0) {
				for (const item of receivedData) {
					item.enable = false;
					items.push(item);
				}
			}
			this.specialItem = items;
			//const curr = this.specialItem.map(data => { return { name: data.CodeName, type: data.Type } });

			var flags = [], output = [], l = this.specialItem.length, i;
			for (i = 0; i < l; i++) {
				if (flags[this.specialItem[i].Type]) continue;
				flags[this.specialItem[i].Type] = true;
				if (this.specialItem[i].Type === 'Oncall') {
					this.specialItem[i].CodeName = 'آنکال'
				}
				output.push(this.specialItem[i]);
			}

			this.specialItemTypes = output;
			this.dataSpecialItems.next('isLoadedData');
		});
	}

	getDepartmentDetails(code: string, MenuItemID: number, OnlineUserId: number) {
		this.multiselectDepartmentList = [];

		this.server.getDepartmentDetails(code, MenuItemID, OnlineUserId).subscribe(data => {
			if (data.length > 0) {
				this.multiselectDepartmentList = data;
			}
		})
	}

	modifySchedulingProgDetail(jsonSchedulingProgItem: any) {
		this.globalPopupService.preloader('show');
		this.server.modifySchedulingProgDetail(jsonSchedulingProgItem).subscribe(data => {
			var result = JSON.parse(JSON.parse(data));
			// if (this.showBtnSetting[0] == 1) {
			// 	if (this.showBtnSetting[1] == 2) {
			// 		//if save and final is active and click on final then
			// 		//disactive all
			// 		this.showBtnSetting[0] = 0;
			// 		this.showBtnSetting[1] = 0;
			// 	} else {
			// 		//if save is active and click on save then
			// 		//active final
			// 		this.showBtnSetting[1] = 2;
			// 	}
			// }
			this.globalPopupService.preloader('hide');
			if (result['Success'] === true) {
				// Success
				this.globalPopupService.toast(result['Message'], 'success');
			} else if (result['Success'] === false) {
				// Failed
				this.globalPopupService.toast(result['Message'], 'error');
			}
		});
	}

	searchOnPersonName(input) {
		if (this.personNameSearchModel == "") {
			this.SchedulingProgDetailList = this.SchedulingProgDetailList_orginal;
		} else {
			// جهت تبدیل ی و ک عربی به ي و ك فارسی
			this.personNameSearchModel = this.personNameSearchModel.replace(/ك/g, 'ک').replace(/ي/g, 'ی');
			this.SchedulingProgDetailList = [];
			this.SchedulingProgDetailList = this.SchedulingProgDetailList_orginal.filter(
				p => p.PersonInfo.PersonName.toString().includes(this.personNameSearchModel)
			);
		}
	}

	sort() {
		if (this.sort_setting.sortItem != '' && this.SchedulingProgDetailList.length > 0) {
			if (typeof this.SchedulingProgDetailList[0].PersonInfo[this.sort_setting.sortItem] == 'object') {
				if (typeof this.SchedulingProgDetailList[0].PersonInfo[this.sort_setting.sortItem].name == 'number') {
					this.SchedulingProgDetailList.sort((a, b) => {
						return a.PersonInfo[this.sort_setting.sortItem].name - b.PersonInfo[this.sort_setting.sortItem].name;
					});
				} else {
					this.SchedulingProgDetailList.sort((a, b) => {
						if (a.PersonInfo[this.sort_setting.sortItem].name < b.PersonInfo[this.sort_setting.sortItem].name) { return -1; }
						if (a.PersonInfo[this.sort_setting.sortItem].name > b.PersonInfo[this.sort_setting.sortItem].name) { return 1; }
						return 0;
					});
				}
			} else {
				if (typeof this.SchedulingProgDetailList[0].PersonInfo[this.sort_setting.sortItem] == 'number') {
					this.SchedulingProgDetailList.sort((a, b) => {
						return a.PersonInfo[this.sort_setting.sortItem] - b.PersonInfo[this.sort_setting.sortItem];
					});
				} else {
					this.SchedulingProgDetailList.sort((a, b) => {
						if (a.PersonInfo[this.sort_setting.sortItem] < b.PersonInfo[this.sort_setting.sortItem]) { return -1; }
						if (a.PersonInfo[this.sort_setting.sortItem] > b.PersonInfo[this.sort_setting.sortItem]) { return 1; }
						return 0;
					});
				}
			}

			if (this.sort_setting.sortType == 'Desc') {
				this.SchedulingProgDetailList.reverse();
			}
		}
	}

	saveSort() {
		const SortItem = {
			OnlineUserId: this.inputParams.OnlineUserId,
			menuItemId: this.inputParams.MenuItemId,
			HasSort: true,
			Id: this.sort_setting.id,
			SortType: '\'' + this.sort_setting.sortType + '\'',
		};

		this.server.saveSort(SortItem).subscribe(data => {
			console.log('sort data : ', data);
		});
	}

	// Add New Message Function
	getAllNotifyMessage() {
		this.server.getAllNotifyMessages(this.inputParams.OnlineUserId, this.inputParams.MenuItemId, 540, '540').subscribe(data => {
			this.listNotifyMessage = JSON.parse(data);
			this.paginateNotifyMessage.total = Math.ceil(this.listNotifyMessage.length / this.paginateNotifyMessage.limit)

			this.dataMessage.next('All Message Get!');

			this.listNotifyMessage.forEach(msg => {
				this.SchedulingProgDetailList.forEach(row => {
					if (row.PersonInfo.PersonID == msg.OwnerId) {
						for (const key in row.Days) {
							if (row.Days[key] != null) {
								if (row.Days[key].Date == msg.Date) {
									row.Days[key].HasMessage = true;
									break;
								}
							}
						}
					}
				});
			});
		});
	}

	submitNewMesage() {
		var notifyMessage = {
			OnlineUserId: this.inputParams.OnlineUserId,
			TableId: 540,
			Message: "'" + this.messageSelectedCell.message + "'",
			OwnerId: null,
			Date: null,
			PageId: 93002,
			WorkPeriodID: 72
		};
		switch (this.messageSelectedCell.type) {
			case 'day':
				notifyMessage.Date = "'" + this.messageSelectedCell.day.Date + "'";
				notifyMessage.OwnerId = this.messageSelectedCell.person.PersonID;
				break;
			case 'person':
				notifyMessage.OwnerId = this.messageSelectedCell.person.PersonID;
				break;
			case 'column':
				notifyMessage.Date = "'" + this.messageSelectedCell.day.Date + "'";
				break;
		}

		this.globalPopupService.preloader('show');

		this.server.saveNotifyMessage(notifyMessage).subscribe(data => {
			const dataRecived = JSON.parse(JSON.parse(data));

			this.globalPopupService.preloader('hide');

			if (dataRecived.Success) {
				this.showAddNewMsgComponent = false;
				this.chooseCellMode = false;

				this.SchedulingProgDetailList.forEach(row => {
					if (this.messageSelectedCell.person != null) {
						if (row.PersonInfo.PersonID == this.messageSelectedCell.person.PersonID) {
							for (const key in row.Days) {
								if (row.Days[key] != null) {
									if (row.Days[key].DayNo == this.messageSelectedCell.day.DayNo) {
										row.Days[key].HasMessage = true;
										this.messageSelectedCell = {
											type: '',
											day: {},
											person: {},
											message: ''
										};
										break;
									}
								}
							}
						}
					}
				});

				this.getAllNotifyMessage();

				this.globalPopupService.toast(dataRecived.Message, 'success');
			} else {
				this.globalPopupService.toast(dataRecived.Message, 'error');
			}
		});
	}

	confirmDeleteMessage(msg) {
		this.showConfirmComponent.show = true;
		this.showConfirmComponent.msg = msg;
	}

	deleteNotifyMessage(msg) {
		var notifyMessage = {
			Id: msg.Id,
			onlineUserId: this.inputParams.OnlineUserId
		};
		this.globalPopupService.preloader('show');

		this.server.deleteNotifyMessage(notifyMessage).subscribe(data => {
			const dataRecived = JSON.parse(JSON.parse(data));
			this.globalPopupService.preloader('hide');

			if (dataRecived.Success) {
				var index = this.listNotifyMessage.indexOf(msg);

				// delete Has Message
				this.SchedulingProgDetailList.forEach(row => {
					if (msg.OwnerId != null) {
						if (row.PersonInfo.PersonID == msg.OwnerId) {
							for (const key in row.Days) {
								if (row.Days[key] != null) {
									if (row.Days[key].Date == msg.Date) {
										row.Days[key].HasMessage = false;
										break;
									}
								}
							}
						}
					}
				});
				this.listNotifyMessage.splice(index, 1);
				this.showConfirmComponent.msg = {};

				// 
				this.paginateNotifyMessage.paginate = 0;
				this.getAllNotifyMessage();
				this.globalPopupService.toast(dataRecived.Message, 'success');
			} else {
				this.globalPopupService.toast(dataRecived.Message, 'error');
			}
		});
	}

	readNotifyMessae() {
		var listReadMsg = { Messages: [] };
		for (let index = 0; index < this.listNotifyMessage.length; index++) {
			if ((index >= this.paginateNotifyMessage.paginate * this.paginateNotifyMessage.limit) && (index < (this.paginateNotifyMessage.paginate + 1) * this.paginateNotifyMessage.limit)) {
				const element = this.listNotifyMessage[index];
				var notifyMessage = {
					Id: 0,
					OnlineUserId: this.inputParams.OnlineUserId,
					TableId: this.inputParams.PaymentItemId,
					PageId: 90027
				};
				if (!element.IsRead) {
					notifyMessage.Id = element.Id;
					listReadMsg.Messages.push(notifyMessage)
				}
			}
		}
		// Send Read Message To Server
		this.server.modifyReadState(listReadMsg).subscribe(data => {
			const dataRecived = JSON.parse(JSON.parse(data));
			if (dataRecived.Success) {
				for (let index = 0; index < this.listNotifyMessage.length; index++) {
					if ((index >= this.paginateNotifyMessage.paginate * this.paginateNotifyMessage.limit) && (index < (this.paginateNotifyMessage.paginate + 1) * this.paginateNotifyMessage.limit)) {
						const element = this.listNotifyMessage[index];
						element.IsRead = true;
					}
				}
			}
		});
	}

	// Filter Function
	createFiltersList() {
		// console.log('this.listPersonItems', this.listPersonItems);
		for (const item of this.listPersonItems) {
			if (item.HasFilter) {
				this.activeFilterBtn = true;
			}
			if (item.Filterable) {
				const existFilterItem = this.listAvailableFilter.find(x => x.id == item.Id);
				const indexOfFilter = this.listAvailableFilter.indexOf(existFilterItem);
				if (indexOfFilter !== -1) {
					for (const schedulingProgDetail of this.SchedulingProgDetailList_orginal) {
						const condition = this.listAvailableFilter[indexOfFilter].FilterValue
							.find(x => x.id == schedulingProgDetail.PersonInfo[this.listAvailableFilter[indexOfFilter].name].id);
						const filterStatus = item.FilterValue
							.find(x => parseInt(x.Id) == schedulingProgDetail.PersonInfo[this.listAvailableFilter[indexOfFilter].name].id);

						if (condition == undefined) {
							this.listAvailableFilter[indexOfFilter].FilterValue.push({
								name: this.listAvailableFilter[indexOfFilter].name,
								id: schedulingProgDetail.PersonInfo[this.listAvailableFilter[indexOfFilter].name].id,
								description: schedulingProgDetail.PersonInfo[this.listAvailableFilter[indexOfFilter].name].name,
								hasFilter: false,
							});
							if (filterStatus != undefined) {
								this.listAvailableFilter[indexOfFilter].FilterValue.hasFilter = true;
							}
						}
					}
				} else {
					const object = {
						id: item.Id,
						description: item.Description,
						name: item.Name,
						FilterValue: []
					};
					this.groupByFilter(object, item);
				}
			}
		}
		// console.log('this.listAvailableFilter', this.listAvailableFilter)
		this.filterList();
	}

	groupByFilter(object, filterItem) {
		for (const schedulingProgDetail of this.SchedulingProgDetailList_orginal) {
			const condition = object.FilterValue.find(x => x.id == schedulingProgDetail.PersonInfo[object.name].id);
			const filterStatus = filterItem.FilterValue.find(x => parseInt(x.Id) == schedulingProgDetail.PersonInfo[object.name].id);

			if (condition == undefined && filterStatus != undefined) {
				object.FilterValue.push({
					name: object.name,
					id: schedulingProgDetail.PersonInfo[object.name].id,
					description: schedulingProgDetail.PersonInfo[object.name].name,
					hasFilter: true,
				});
			}

			if (condition == undefined && filterStatus == undefined) {
				object.FilterValue.push({
					name: object.name,
					id: schedulingProgDetail.PersonInfo[object.name].id,
					description: schedulingProgDetail.PersonInfo[object.name].name,
					hasFilter: false,
				});
			}
		}
		this.listAvailableFilter.push(object);
	}

	filterList() {
		const list = [];
		let existHasFilter = false;

		for (const person of this.SchedulingProgDetailList_orginal) {
			let filterConditon = false;
			for (const filter of this.listAvailableFilter) {
				for (const filterItem of filter.FilterValue) {
					if (filterItem.hasFilter) {
						existHasFilter = true;
						// console.log('item.id',item.id)
						// console.log('person.PersonInfo[item.name].id',person.PersonInfo[item.name].id);
						if (person.PersonInfo[filterItem.name].id == filterItem.id) {
							filterConditon = true;
							// console.log('filterConditon', filterConditon)
							break;
						}
					}
				}
			}
			// console.log('Final FilterConditon-->', filterConditon)
			if (filterConditon) {
				list.push(person);
			}
		}
		if (existHasFilter) {
			// this.listSpreadPaymentItems = [];
			this.SchedulingProgDetailList = list;
			this.activeFilterBtn = true;

			//   this.listPageNumber = Array.from(Array(Math.ceil(this.listSpreadPaymentItems.length / (this.pagingLimitNumber))), (x, i) => i);
			//   if (this.listPageNumber.length === 0) {
			// 	this.listPageNumber.push(0);
			//   }
		} else {
			this.activeFilterBtn = false;
			this.SchedulingProgDetailList = this.SchedulingProgDetailList_orginal;
		}
	}

	saveFilter() {
		const sendobject = [];
		for (const filterParent of this.listAvailableFilter) {
			const object = [];

			for (const filterItem of filterParent.FilterValue) {
				if (filterItem.hasFilter) {
					object.push({ id: filterParent.id, val: filterItem.id });
				}
			}
			if (object.length > 0) {
				sendobject.push({
					PaymentItemId: this.inputParams.PaymentItemId,
					OnlineUserId: this.inputParams.OnlineUserId,
					menuItemId: 90027,
					Id: filterParent.id,
					HasFilter: true,
					FilterValues: { value: object },
				});
			}
		}

		const FilterItems = {
			FilterItems: { item: sendobject },
			// PaymentItemId: this.inputParams.PaymentItemId,
			// OnlineUserId: this.inputParams.OnlineUserId,
			// menuItemId: 90027
		};
		// console.log('FilterItems', FilterItems);
		this.server.saveFilter(FilterItems).subscribe(data => {
			// console.log('filter data : ', data);
		});
	}

	get_ShiftVersions_LComboListData() {
		this.server.getLComboData("1", "ShiftVersions", "93").subscribe(data => {
			this.ShiftVersions_LComboListData = data;
			this.ShiftVersions_model = Number(this.inputParams.Version);
		})
	}

	get_ReplaceShiftWP_LComboListData() {
		this.server.getReplaceShiftWPData("1", "ReplaceShiftWP", "93").subscribe(data => {
			this.ReplaceShiftWP_LComboListData = data;

			this.ReplaceShiftWP_model = Number(this.inputParams.WPID);
			if (this.ReplaceShiftWP_model == 0) {
				this.ReplaceShiftWP_model = data.filter(element => element.defaultt == 1)[0].val;
			}
		})
	}

	// Cartable Controller
	getPersonDetails(pCode: string, MenuItemID: number) {
		this.server.getPersonDetails(pCode, MenuItemID).subscribe(data => {
			if (data.length > 0) {
				this.listPersonData = data;
			}
		})
	}

	getDocumentType_LComboListData() {
		this.server.getLComboData("1", "HisDocType", "93").subscribe(data => {
			this.documentType_LComboListData = data;
		})
	}

	getCartableList() {
		this.server.getCartableList(this.multiselectDepartmentModel[0].Id, this.ReplaceShiftWP_model, 0, this.inputParams.MenuItemId, this.inputParams.SystemId, this.inputParams.OnlineUserId).subscribe(data => {
			var dataRecived = JSON.parse(data);
			this.listCartable = dataRecived;
			this.listCartable_Orginal = dataRecived;
			console.log('Cartable:', this.listCartable);
			this.updateSchedulingProgDetailDaysWithCartable();

			this.paginateCartable.total = Math.ceil(this.listCartable.length / this.paginateCartable.limit);
		})
	}

	updateSchedulingProgDetailDaysWithCartable() {
		if (this.listCartable.length > 0 && this.SchedulingProgDetailList.length > 0) {
			this.listCartable_Orginal.forEach(cartableItem => {
				var selectedPerson: any = this.SchedulingProgDetailList.filter(item => item.PersonInfo.PersonID == cartableItem.DocMemberID);
				if (selectedPerson.length > 0) {
					Object.keys(selectedPerson[0].Days).forEach(dayKeyName => {
						var day: any = selectedPerson[0].Days[dayKeyName];
						day.CartableStructures = [];
						debugger;
						if (day.Date == cartableItem.DocSDate) {
							day.hasCartable = true;
						}
					})
				}
			});
		}
	}	
}