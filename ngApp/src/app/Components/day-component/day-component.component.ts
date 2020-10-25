import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';
import { StructureService } from "../../Services/structure.service";
import { CartableService } from '../../Services/cartable.service';

@Component({
	selector: 'app-day-component',
	templateUrl: './day-component.component.html',
	styleUrls: ['./day-component.component.scss']
})
export class DayComponentComponent implements OnInit {
	@Input() dayInfo: any;

	public cartableStructureList = [];
	public dayCartableList: any = [];

	constructor(
		public service: AppService, 
		public structureService: StructureService,
		public cartableService:CartableService) { }

	ngOnInit() {

	}

	showCloseBtn(structure) {
		structure.showFlag = true;
	}

	hideCloseBtn(structure) {
		structure.showFlag = false;
	}

	getSpecialItemOfStructure(structure: any) {
		var enabledSpecialItems = this.structureService.getEnabledSpecialItems();
		var spiSelected = enabledSpecialItems.filter((spi, index) => spi.CategoryStructureID == structure.CategoryStructureID)
		if (spiSelected.length > 0) {
			return spiSelected[0].Type
		} else {
			return "";
		}
	}


	getOncallColor(structure: any) {
		var oncallSpi = this.dayInfo.SpecialItems.filter(spi => {
			return (spi.CategoryStructureID == structure.CategoryStructureID) && (spi.Type == 'Oncall')
		});

		if (oncallSpi.length > 0) {
			return this.structureService.ToolbarSpecialItemList.filter(spi => spi.Type == 'Oncall')[0].color;
		} else {
			return ""
		}
	}

	hasCartable() {
		if (this.service.Permisions.cartable) {
			return this.getCartable().length > 0;
		}
	}

	getCartable():any {
		var dayCartableList: any = [];

		if (this.cartableService.isShowfilteredCartableChanges) {
			dayCartableList = this.service.listCartable.filter(cartable => {
				return cartable.DocSDate == this.dayInfo.Date && cartable.DocMemberID == this.dayInfo.PersonID
			})
		} else {
			dayCartableList = this.service.listCartable_Orginal.filter(cartable => {
				return cartable.DocSDate == this.dayInfo.Date && cartable.DocMemberID == this.dayInfo.PersonID
			})
		}

		return dayCartableList;
	}

	cartableCondition(): boolean {
		if (this.dayInfo.hasCartable && this.cartableService.isShowCartableChanges) {
			if( this.dayCartableList.length == 0 ){
				this.createCartableStructureList();
			}
			return true;
		} else {
			return false;
		}
	}

	checkCartableCondition():boolean{
		if (this.dayInfo.hasCartable && this.cartableService.isShowCartableChanges) {
			return true;
		} else {
			return false;
		}
	}

	createCartableStructureList(){
		this.getCartable();
		this.structureService.createStructureList(this.dayInfo.PersonID, (strList)=>{

		});
	}

	getCartableListWithStructureCredit():any{
		var cartableList = this.getCartable();

		if( cartableList.length > 0 ){
			return cartableList.filter(item => item.StructureID != 0);
		} else {
			return [];
		}
	}

	getStructureClass(structure: any) {
		var classArray: any = [];

		switch (structure.CategoryStructureTitle) {
			case "M": {
				classArray.push("m-str");
				break;
			}
			case "E": {
				classArray.push("e-str");
				break;
			}
			case "N": {
				classArray.push("n-str");
				break;
			}
		}

		if (structure.OtherDepartmentStructure) {
			classArray.push('other-dept');
		}

		return classArray;
	}

	getStructureStyle(structure: any) {
		var styleObj: any = {};
		var oncallcolor = this.getOncallColor(structure);
		styleObj["background-color"] = oncallcolor;
		styleObj["border-color"] = oncallcolor;

		if( this.dayInfo.hasCartable ){
			if( structure.CartableDocTypeTitle == "remove" ){
				styleObj["background-color"] = "#9E9E9E";
				styleObj["border-color"] = "#9E9E9E";				
			}
		}

		return styleObj;
	}

	getStructureTitle(structure: any) {
		return structure.CategoryStructureTitle;
	}
}