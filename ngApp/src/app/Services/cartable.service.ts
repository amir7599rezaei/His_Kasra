import { Injectable } from '@angular/core';
import { ServerService } from '../server.service';
import { AppService } from '../app.service';
import { StructureService } from './structure.service';
import { GlobalPopupService } from './global-popup.service';

@Injectable()
export class CartableService {

	public isShowCartableChanges: boolean = false;
	public isShowfilteredCartableChanges: boolean = false;

	constructor(
		public server: ServerService,
		public appService: AppService,
		public globalPopupService: GlobalPopupService,
		public structureService: StructureService) { }

	createCartableStructureList() {
		this.globalPopupService.preloader("show");

		this.appService.SchedulingProgDetailList.forEach(spItem => {
			Object.keys(spItem.Days).forEach(dayKeyName => {
				var day: any = spItem.Days[dayKeyName];
				if (day.hasCartable) {
					var cartableList = this.getCartableOfPersonOnDay(day.PersonID, day.Date);
					day.CartableStructures = JSON.parse(JSON.stringify(day.Structures));
					cartableList.forEach(cartableItem => {
						debugger;
						//بدست آوردن کارتابل ها با کتگوری یکسان
						var sameCartable = cartableList.filter(item => item.CategoryStructureID == cartableItem.CategoryStructureID && item.StructureID != cartableItem.StructureID)
						if (sameCartable.length > 0) {
							//تبدیل ساختار
							//حذف کارتابل تکراری از لیست
							cartableList.splice(cartableList.indexOf(sameCartable[0]), 1);
							day.CartableStructures.forEach(item => {
								if( item.StructureID == cartableItem.StructureID ){
									//day.CartableStructures.splice(item, 1);
									item.CartableDocTypeTitle = "change";
								}
							});
						} else {
							if (cartableItem.DocTypeID == 40) {
								//حذف ساختار
								day.CartableStructures.forEach(item => {
									if( item.StructureID == cartableItem.StructureID ){
										//day.CartableStructures.splice(item, 1);
										item.CartableDocTypeTitle = "remove";
									}
								});
							} else if( cartableItem.DocTypeID == 35 ){
								//ایجاد ساختار
								this.structureService.toolbarStructuresList.forEach(item=>{
									if( item.CategoryStructureID == cartableItem.CategoryStructureID ){
										var structure = JSON.parse(JSON.stringify(item));
										structure.StructureID = cartableItem.StructureID;
										structure.StructureTitle = structure.CategoryStructureTitle;
										structure.CartableDocTypeTitle = "add";
										day.CartableStructures.push( structure );
									}
								})
							}							
						}
					});
				}
			})
		})

		this.globalPopupService.preloader("hide");
	}

	getCartableOfPersonOnDay(PersonID: any, date: any) {
		var dayCartableList: any = [];
		//DocTypeID 35 is added str
		//DocTypeID 40 is removed str

		if (this.isShowfilteredCartableChanges) {
			dayCartableList = this.appService.listCartable.filter(cartable => {
				return cartable.DocSDate == date && cartable.DocMemberID == PersonID && (cartable.DocTypeID == 35 || cartable.DocTypeID == 40);
			})
		} else {
			dayCartableList = this.appService.listCartable_Orginal.filter(cartable => {
				return cartable.DocSDate == date && cartable.DocMemberID == PersonID && (cartable.DocTypeID == 35 || cartable.DocTypeID == 40);
			})
		}

		return dayCartableList;
	}
}
