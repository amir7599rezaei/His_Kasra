import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LCombo } from './Models/LCombo.model'

@Injectable()
// @Injectable({
//   providedIn: 'root'
// })

export class ServerService {

	httpOption;
	HIS_ApiUrl: string;
	lego_ApiUrl: string;

	rootPath: string;


	constructor(public http: HttpClient) {

		this.rootPath = "Lego.Web";

		this.HIS_ApiUrl = '/Lego.Web/api/HIS/';
		this.lego_ApiUrl = '/Lego.Web/api/Lego/';

		// this.HIS_ApiUrl = 'http://localhost:89/Lego.Web/api/HIS/';
		// this.lego_ApiUrl = 'http://localhost:89/Lego.Web/api/Lego/';    

		this.httpOption = {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded'
			})
		};


	}

	setApiUrl(lego_ApiUrl: string, his_ApiUrl: string) {
		if (lego_ApiUrl != "" && his_ApiUrl != "") {
			this.lego_ApiUrl = lego_ApiUrl;
			this.HIS_ApiUrl = his_ApiUrl;
		}
	}

	getSchedulingProgDetail(DepartmentID: number, WPID: number, Version: number, AccordingTo: string, WeekNumber: number, MenuItemId: number, SystemId: number, OnlineUserId: number): Observable<any> {
		return this.http.get<any>(this.HIS_ApiUrl + 'SchedulingProgAPI/SchedulingProgDetail_get?DepartmentID=' + DepartmentID + '&WPID=' + WPID + '&Version=' + Version + '&AccordingTo=' + AccordingTo + '&WeekNumber=' + WeekNumber + '&MenuItemId=' + MenuItemId + '&SystemId=' + SystemId + '&OnlineUserId=' + OnlineUserId);
	}

	getDepartmentDetails(code: string, MenuItemID: number, OnlineUserId: number) {
		return this.http.get<any>(this.lego_ApiUrl + 'DepartmentAPI/LoadDepartmentData?Code=' + code + '&MenuItemId=' + MenuItemID + '&OnlineUserId=' + OnlineUserId);
	}

	modifySchedulingProgDetail(jsonSchedulingProgItem: any): Observable<any> {
		var body = new HttpParams();

		body=body.append('jsonSchedulingProgItem', JSON.stringify(jsonSchedulingProgItem));
		//body=body.append('jsonSchedulingProgDetail', JSON.stringify(SchedulingProgDetailHead));

		return this.http.post(this.HIS_ApiUrl + 'SchedulingProgAPI/ModifySchedulingProgItem', body.toString(), this.httpOption);
	}

	getUiSettings(MenuItemID: number, onlineUserId: number): Observable<any> {
		return this.http.get<any>(this.lego_ApiUrl + 'UISettingAPI/UISettingList_get?OnlineUserId='
			+ onlineUserId + '&MenuItemId=' + MenuItemID + '&memberType=p');
	}

	saveSort(SorttItem: any): Observable<any> {
		const body = new HttpParams()
			.set('SortItem', JSON.stringify(SorttItem));

		return this.http.post(this.lego_ApiUrl + 'UISettingAPI/ModifySortSetting', body.toString(), this.httpOption);
	}

	// لیست انوع استراکچرها (صبح و عصر و شب)
	getStructures(menuItemId: number, systemId: number, onlineUserId: number, wpId: number): Observable<any> {
		return this.http.get<any>(this.HIS_ApiUrl + 'SchedulingProgAPI/Structures_get?&MenuItemId=' + menuItemId + '&SystemId=' + systemId + '&OnlineUserId=' + onlineUserId + '&wpId=' + wpId);
	}

	// لیست انواع آیتم های خاص برای نمایش دکمه ها
	getSpecialItems(menuItemId: number, systemId: number, onlineUserId: number): Observable<any> {
		return this.http.get<any>(this.HIS_ApiUrl + 'SchedulingProgAPI/SpecialItems_get?&MenuItemId=' + menuItemId + '&SystemId=' + systemId + '&OnlineUserId=' + onlineUserId);
	}

	// لیست پیام های آنلاین یوزر
	getAllNotifyMessages(onlineUserId: number, menuItemId: number, PaymentItemId: number, depid): Observable<any> {
		return this.http.get<any>(this.lego_ApiUrl + 'NotifyMessageAPI/NotifyMessageList_get?OnlineUserId='
			+ onlineUserId + '&MenuItemId=' + menuItemId + '&SystemId=93&spreadPaymentItemId=' + PaymentItemId + '&depid=' + depid
		);
	}

	saveNotifyMessage(notifyMessage: any): Observable<any> {
		// مدل این شکلی ارسال شود :
		//  notifyMessage = {
		//   OnlineUserId: this.inputParams.OnlineUserId,
		//   TableId: this.inputParams.PaymentItemId,
		//   Message: "'نتمتمتنتننتت'",     //---// حتما استرینگ ارسال شود
		//   OwnerId: 123457346,
		//   Date: '1397/10/01',
		//   PageId: 93002,
		// 	 WorkPeriodID : 10
		// };
		const body = new HttpParams()
			.set('NotifyMessage', JSON.stringify(notifyMessage));
		return this.http.post(this.lego_ApiUrl + 'NotifyMessageAPI/SaveHisNotifyMessage', body.toString(), this.httpOption);
	}

	deleteNotifyMessage(notifyMessage: any): Observable<any> {
		// مدل این شکلی ارسال شود :
		// notifyMessage = {
		//   Id: 11,
		//   onlineUserId: 1
		// };
		const body = new HttpParams()
			.set('NotifyMessage', JSON.stringify(notifyMessage));
		return this.http.post(this.lego_ApiUrl + 'NotifyMessageAPI/DeleteNotifyMessage', body.toString(), this.httpOption);
	}

	modifyReadState(notifyMessage: any): Observable<any> {
		// مدل این شکلی ارسال شود :
		// notifyMessage = {
		//   Messages: [{
		//     Id: 6,
		//     OnlineUserId: 1,
		//     TableId: 3,
		//     PageId: 90027
		//   },
		//   {
		//     Id: 7,
		//     OnlineUserId: 1,
		//     TableId: 3,
		//     PageId: 90027
		//   }]
		// };
		const body = new HttpParams()
			.set('NotifyMessage', JSON.stringify(notifyMessage));
		return this.http.post(this.lego_ApiUrl + 'NotifyMessageAPI/ModifyNotifyMessageReadState', body.toString(), this.httpOption);
	}

	saveFilter(FilterItems: any): Observable<any> {
		const body = new HttpParams()
			.set('FilterModel', JSON.stringify(FilterItems));
		return this.http.post(this.lego_ApiUrl + 'UISettingAPI/ModifyFilterSetting', body.toString(), this.httpOption);
	}

	getLComboData(LookupType: string = "", LookupName: string = "", LookupParam: string = ""): Observable<any> {
		return this.http.get<any>(this.HIS_ApiUrl + 'LComboAPI/GetData?LookupType=' + LookupType + '&LookupName=' + LookupName + '&LookupParam=' + LookupParam);
	}

	getReplaceShiftWPData(LookupType: string = "", LookupName: string = "", LookupParam: string = ""): Observable<any> {
		return this.http.get<any>(this.HIS_ApiUrl + 'LComboAPI/GetWorkPeriod?LookupType=' + LookupType + '&LookupName=' + LookupName + '&LookupParam=' + LookupParam);
	}

	getPersonDetails(pCode: string, MenuItemID: number) {
		return this.http.get<any>(this.lego_ApiUrl + 'PersonAPI/LoadPersonData?PCode=' + pCode + '&PageId=' + MenuItemID);
	}

	getCartableList(DepartmentID: number, WPID : number,Version: number,MenuItemId: number,SystemId: number,OnlineUserId: number) {
		return this.http.get<any>(this.HIS_ApiUrl + 'SchedulingProgAPI/GetCartable?DepartmentID='+DepartmentID +'&WPID='+WPID+'&Version='+Version+'&MenuItemId='+MenuItemId+'&SystemId='+SystemId+'&OnlineUserId='+OnlineUserId);
	}

	getStructureOfDepartment(DepartmentID: number, WPID:number, MenuItemId:number, SystemId: number,OnlineUserId: number){
		return this.http.get<any>(this.HIS_ApiUrl + 'SchedulingProgAPI/GetStructureOfDepartment_get?DepartmentID='+DepartmentID +'&WPID='+WPID+'&MenuItemId='+MenuItemId+'&SystemId='+SystemId+'&OnlineUserId='+OnlineUserId);
	}

	ModifyCartable(jsonSchedulingProgItem: any): Observable<any> {
		var body = new HttpParams();

		body=body.append('jsonSchedulingProgItem', JSON.stringify(jsonSchedulingProgItem));
		
		return this.http.post(this.HIS_ApiUrl + 'SchedulingProgAPI/ModifyCasingWorkTable', body.toString(), this.httpOption);
	}
}
