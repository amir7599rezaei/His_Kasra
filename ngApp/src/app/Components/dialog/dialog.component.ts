import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { DialogService } from "../../Services/dialog.service";

@Component({
	selector: 'ng-dialog',
	template: `
		<div class="ng-dialog-content">
			<div class="dialog-header clearfix">
				<span class="dialog-close" (click)="this.close()">&times;</span>
			</div>
			<div class="dialog-body">
				<ng-content></ng-content>
			</div>
		</div>
	`
})
export class DialogComponent implements OnInit {
	@Input() id:string;
	@Input() width:string;
	@Input() height:string;
	private element: any;

	public dialogStyle:object = {};

	constructor(public service:DialogService, private el: ElementRef) {
		this.element = el.nativeElement;
	}

	ngOnInit() {
		let dialog = this;
		this.dialogStyle["width"] = this.width;
		this.dialogStyle["height"] = this.height;

		this.service.add( dialog );
	}

    // open modal
    open(): void {
        this.element.style.display = 'block';
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
    }	

}
