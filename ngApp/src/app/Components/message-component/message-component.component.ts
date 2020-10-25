import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-message-component',
  templateUrl: './message-component.component.html',
  styleUrls: ['./message-component.component.scss']
})
export class MessageComponentComponent implements OnInit, OnChanges {

  // @Input() service.showMessageComponent: boolean;

  constructor(public service: AppService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('service.showMessageComponent',this.service.showMessageComponent)
  }

  openMessageBox() {
    this.service.showMessageComponent = !this.service.showMessageComponent;
    if (this.service.showMessageComponent) {
      this.service.readNotifyMessae();
    }
  }

  goNextPage() {
    if (this.service.paginateNotifyMessage.paginate + 1 < this.service.paginateNotifyMessage.total) {
      this.service.paginateNotifyMessage.paginate += 1;
      this.service.readNotifyMessae();
    }
  }

  goPrevPage() {
    if (this.service.paginateNotifyMessage.paginate + 1 > 1) {
      this.service.paginateNotifyMessage.paginate -= 1;
      this.service.readNotifyMessae();
    }
  }

  showMsgComponent() {
    this.service.showAddNewMsgComponent = !this.service.showAddNewMsgComponent;
  }
}
