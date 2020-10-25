import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-confirm-components',
  templateUrl: './confirm-components.component.html',
  styleUrls: ['./confirm-components.component.scss']
})
export class ConfirmComponentsComponent implements OnInit {

  constructor(public service: AppService) { }

  ngOnInit() {
  }

  confirm(){
    this.service.showConfirmComponent.show = false;
    this.service.deleteNotifyMessage(this.service.showConfirmComponent.msg);
  }

  cancel(){
    this.service.showConfirmComponent.show = false;
    this.service.showConfirmComponent.msg = {};
  }

}
