import { Injectable } from '@angular/core';

@Injectable()

export class GlobalPopupService {
	private _localNamespaceObject:any;

	constructor() {
		this.localNamespaceObject = null;
	}

	public set localNamespaceObject(v: any) {
		this._localNamespaceObject = v;
	}

	toast(message:string, type:string){
		if( this._localNamespaceObject ){
			this._localNamespaceObject.call_toast( message, type );
		} else {
			alert( message );
		}
	}

	preloader(action:string){
		if( this._localNamespaceObject ){
			this._localNamespaceObject.call_preloader( action );
		} else {
		//	
		}		
	}

	modal(option:object){
		if( this._localNamespaceObject ){
			this._localNamespaceObject.call_modal( option );
		} else {
		//	
		}		
	}

	notifier(message:string, type:string, options:object){
		if( this._localNamespaceObject ){
			this._localNamespaceObject.call_notifier(message, type, options);
		} else {
		//	
		}		
	}
}
