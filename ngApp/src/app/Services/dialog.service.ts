import { Injectable } from '@angular/core';

@Injectable()

export class DialogService {
	private dialogs:any[] = []; 

	constructor() { }

    add(dialog: any) {
        this.dialogs.push(dialog);
    }

    remove(id: string) {
        this.dialogs = this.dialogs.filter(x => x.id !== id);
    }

    open(id: string) {
        let dialog: any = this.dialogs.filter(x => x.id === id)[0];
        dialog.open();
    }

    close(id: string) {
        let dialog: any = this.dialogs.filter(x => x.id === id)[0];
        dialog.close();
    }	
}
