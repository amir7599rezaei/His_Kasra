import { Injectable } from '@angular/core';
import { Structure } from "../Models/Structure";
import { ServerService } from "../server.service";
import { AppService } from "../app.service";
import { GlobalPopupService } from "./global-popup.service";
import { Subject } from 'rxjs';

@Injectable()

export class StructureService {
	public structureList: Array<any>;
	public subStructureList:Array<Structure>;
	public toolbarStructuresList:Array<Structure>;
	public currentAddedStructure:Array<any>;

	public isShowCartableChanges:boolean;

	public SpecialItemList:Array<any>;
	public ToolbarSpecialItemList:Array<any>;

	private enabledSpecialItems:Array<any>;

	private dataStructureList = new Subject();
	public dataStructureList$ = this.dataStructureList.asObservable();	

	constructor(
		public server:ServerService, 
		public appService:AppService, 
		public globalPopupService:GlobalPopupService) {
		this.structureList = [];
		this.subStructureList = [];
		this.toolbarStructuresList = [];

		this.ToolbarSpecialItemList = [];
		this.SpecialItemList = [];
		this.enabledSpecialItems = [];

		this.currentAddedStructure = [];
	}

	public getStructureList(DepartmentID: number, WPID:number, MenuItemId:number, SystemId: number,OnlineUserId: number){
		this.server.getStructureOfDepartment(DepartmentID, WPID, MenuItemId, SystemId, OnlineUserId).subscribe(data => {
			var dataRecived = JSON.parse(data);
			this.structureList = dataRecived[0];
			console.log( "StructureList", dataRecived[0] );
		});
	}

	public getToolbarStructurList(menuItemId: number, systemId: number, onlineUserId: number, wpId: number) {
		this.server.getStructures(menuItemId, systemId, onlineUserId, wpId).subscribe(data => {
			const receivedData = JSON.parse(data);
			const strList: Structure[] = [];
			if (receivedData.length > 0) {
				receivedData.forEach(element => {
					var group = {} as Structure;
					group.CategoryStructureID = element.CategoryStructureID;
					group.CategoryStructureTitle = element.CategoryStructureTitle;
					group.CategoryStructureAcronym = element.CategoryStructureAcronym;
					group.StructureID = element.StructureID;
					group.StructureTitle = element.StructureTitle;
					group.StructureAcronym = element.StructureAcronym;
					group.Karkard = element.Karkard;
					group.enable = false;
					strList.push(group);
				});
			}

			this.toolbarStructuresList = strList;
			console.log( "ToolbarStructureList", strList );
		});
	}	

	getSpecialItemsList(menuItemId: number, systemId: number, onlineUserId: number) {
		this.server.getSpecialItems(menuItemId, systemId, onlineUserId).subscribe(data => {
			const receivedData = JSON.parse(data);
			const items: any = [];
			if (receivedData.length > 0) {
				for (const item of receivedData) {
					item.enable = false;
					items.push(item);
				}
			}
			this.SpecialItemList = items;

			//ساخت آیتم های خصوصیات تولبار
			var flags = [], output = [], l = this.SpecialItemList.length, i;
			for (i = 0; i < l; i++) {
				if (flags[this.SpecialItemList[i].Type]) continue;
				flags[this.SpecialItemList[i].Type] = true;
				if (this.SpecialItemList[i].Type === 'Oncall') {
					this.SpecialItemList[i].CodeName = 'آنکال'
				}
				output.push(this.SpecialItemList[i]);
			}

			this.ToolbarSpecialItemList = output;

			console.log("SpecialItems", this.SpecialItemList);
			console.log("ToolbarSpecialItems", output);
			//this.dataSpecialItems.next('isLoadedData');
		});
	}	

	public getEnabledSpecialItems(): any {
		var selectedSpi: any = null
		selectedSpi = this.SpecialItemList.filter(function (spi, index) {
			return (spi.enable);
		});

		return selectedSpi;
	}	

	public getEnabledToolbarStructures(): any {
		var selectedStr: any = null
		selectedStr = this.toolbarStructuresList.filter(function (str, index) {
			return (str.enable);
		});

		return selectedStr;
	}	

	public getEnabledStructures(): any {
		var selectedStr: any = null
		selectedStr = this.subStructureList.filter(function (str, index) {
			return (str.enable);
		});

		return selectedStr;
	}	

	public createStructureList(personId:number, callback?:(structureList:any)=>any){
		if( this.structureList ){
			this.subStructureList = [];
			var enableToolbarStr = this.getEnabledToolbarStructures();

			enableToolbarStr.forEach(enableStr => {
				var deptStrs = this.structureList["DepartmentStructure"].filter(el=>el.CategoryStructureID == enableStr.CategoryStructureID);
				var prsStrs = this.structureList["PersonelStructure"].filter(el=>{el.CategoryStructureID == enableStr.CategoryStructureID && el.PersonID == personId});

				if(deptStrs.length > 0){
					deptStrs[0].Structures.forEach(element => {
						var str:Structure = new Structure();
						str.enable = false;
						str.CategoryStructureID = element.CategoryStructureID;
						str.CategoryStructureTitle = element.CategoryStructureTitle;
						str.CategoryStructureAcronym = element.CategoryStructureAcronym;
						str.StructureID = element.StructureID;
						str.StructureTitle = element.StructureTitle;
						str.StructureAcronym = element.StructureAcronym;
						str.Karkard = element.Karkard;			
						
						this.subStructureList.push(str);
					});
				}

				if(prsStrs.length > 0){
					prsStrs[0].Structures.forEach(element => {
						var str:Structure = new Structure();
						str.enable = false;
						str.CategoryStructureID = element.CategoryStructureID;
						str.CategoryStructureTitle = element.CategoryStructureTitle;
						str.CategoryStructureAcronym = element.CategoryStructureAcronym;
						str.StructureID = element.StructureID;
						str.StructureTitle = element.StructureTitle;
						str.StructureAcronym = element.StructureAcronym;
						str.Karkard = element.Karkard;	
						
						this.subStructureList.push(str);
					});
				}	
				
			});

			callback(this.subStructureList);
		}
	}

	public addSpecialItem(day:any){
		//get backup of day SpecialItems
		this.enabledSpecialItems = day.SpecialItems;
		debugger
		var enabledSpi = this.getEnabledSpecialItems();
		var enabledStructures = this.getEnabledStructures();

		if (enabledSpi[0].Type === 'Oncall') {
			this.OnCall_callModal(day);
		} else {
			if( enabledSpi[0].CategoryStructureID == 0 ){
				enabledStructures.forEach((str, i)=>{
					var cloneEnabledSpi = JSON.parse(JSON.stringify( enabledSpi[0] ));
					cloneEnabledSpi.CategoryStructureID = str.CategoryStructureID;
					this.enabledSpecialItems.push( cloneEnabledSpi );
				});
			} else {
				this.enabledSpecialItems.push(enabledSpi[0]);
			}
			day.SpecialItems = this.enabledSpecialItems;
		}		
	}
	

	private OnCall_callModal(day) {
		var that = this;
		var enabledStructures = this.getEnabledStructures();
		debugger
		
			enabledStructures.forEach((element, i) => {
				var currentSpi = element;
				var options = {
					title: "آنکالی برای  " + element.CategoryStructureTitle,
					width: "600px",
					height: "500px",
					pageurl: "HIS/OnCall/OncallCodeSetting_Create",
					ajaxData: {
						CategoryStructureTitle: element.CategoryStructureTitle,
						CategoryStructureID: element.CategoryStructureID
					},
					rtl: true,
					has_toolbar: true,
					methodCall: "POST",
					callback_func: (data: any) => {
						if( data == "close" ){
							console.log("closed and current spi is:", currentSpi);
							var addedStr = day.Structures.filter(item=>item.StructureID == currentSpi.StructureID);
							this.removeStructure( addedStr[0], day );
							return;
						}

						var selectedStrFromCallback;
						//بررسی اینکه آیا این خصوصیت در خصوصیات لود شده قبل وجود دارد
						var stuct = that.SpecialItemList.filter(function (element, index) {
							return (element.Id == data.id);
						});
						debugger
						if (stuct.length == 0) {
							var selectedToolbarSampleOncall = this.ToolbarSpecialItemList.filter(spi => spi.Type == 'Oncall')[0];
							data.Type = 'Oncall';
							data.color = selectedToolbarSampleOncall.color;
							data.icon = selectedToolbarSampleOncall.icon;
							that.SpecialItemList.push(data);
							selectedStrFromCallback = data;
						}else{
							selectedStrFromCallback = stuct[0];
						}
	
						that.enabledSpecialItems.push( selectedStrFromCallback );
						day.SpecialItems = that.enabledSpecialItems;
						that.appService.ChangeDetector.detectChanges();

					}
				}
				this.globalPopupService.modal(options);
			});
	}

	public addStructure(day) {
		var enabledStr = this.getEnabledStructures();
		var dayStructures = day.Structures;

		//this.currentAddedStructure

		enabledStr.forEach(element => {
			var current_dayStr = new Structure();
			current_dayStr.ShiftAssignmentID = 0;
			current_dayStr.RequestStructureID = 0;
			current_dayStr.RequestStructureStatus = 0;
			current_dayStr.StructureID = element.StructureID;
			current_dayStr.StructureTitle = element.CategoryStructureTitle;
			current_dayStr.StructureAcronym = element.StructureAcronym;
			current_dayStr.CategoryStructureID = element.CategoryStructureID;
			current_dayStr.CategoryStructureTitle = element.CategoryStructureTitle;
			current_dayStr.CategoryStructureAcronym = element.CategoryStructureTitle;
			current_dayStr.Karkard = element.Karkard;
			current_dayStr.FinalStructureID = 0;
			current_dayStr.FinalStructureTitle = '';
			current_dayStr.FinalStructureAcronym = '';
			current_dayStr.DayStyle = '';

			dayStructures.push(current_dayStr);
		});

		day.Structures = dayStructures;
		
		this.calcFinalStructures(day);
	}	

	private calcFinalStructures(day:any){
		var cloneStructureList = JSON.parse(JSON.stringify(day.Structures));
		var finalStructureTitle = "";
		var finalStructureID = "";

		cloneStructureList.sort(function (a, b) {
			return a.StructureID - b.StructureID;
		});

		cloneStructureList.forEach(str => {
			finalStructureID += str.StructureID + ",";
			finalStructureTitle += str.StructureTitle + ","
		})

		day.Structures.forEach(str => {
			str.FinalStructureID = finalStructureID;
			str.FinalStructureTitle = finalStructureTitle;
		});
	}	

	public removeStructure(structure: any, day: any) {
		var indexStructure = day.Structures.indexOf(structure);
		if (day.Structures.indexOf(structure) > -1) {
			day.Structures.splice(indexStructure, 1);
		}

		//remove specialitems by structure category
		var selectedSpi = day.SpecialItems.filter(function (spi, index) {
			return (spi.CategoryStructureID == structure.CategoryStructureID);
		});
		
		if(selectedSpi.length > 0){
			day.SpecialItems.splice( day.SpecialItems.indexOf(selectedSpi[0]), 1);
		}

		this.calcFinalStructures(day);
	}	

	public check_validation(day:any): object {
		var check_result: boolean = true;
		var message_result:string = "";
		var enabledStr = this.getEnabledStructures();

		if (enabledStr.length == 0) {
			//آیا ساختاری انتخاب شده است
			message_result = "لطفا یک ساختار انتخاب نمایید."
			check_result = false;
		} else {
			//بررسی تکراری بودن یک سختار در یک روز. البته به تغییر نیاز دارد.
			var repeat_str = []
			enabledStr.forEach(function (selStr) {
				var selectedStr_onDay = day.Structures.filter(function (dayStr, index) {
					return (dayStr.CategoryStructureID == selStr.CategoryStructureID);
				});
				if (selectedStr_onDay.length > 0) {
					repeat_str.push(selectedStr_onDay);
				}
			})

			if (repeat_str.length > 0) {
				message_result = "روز جاری دارای ساختار تکراری است."
				check_result = false;
			}
		}

		return {
			success:check_result,
			message:message_result
		}
	}	
}
