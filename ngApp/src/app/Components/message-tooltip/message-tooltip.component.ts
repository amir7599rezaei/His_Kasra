import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-message-tooltip',
  templateUrl: './message-tooltip.component.html',
  styleUrls: ['./message-tooltip.component.scss']
})
export class MessageTooltipComponent implements OnInit {
  @Input() dayInfo: any;
  listSpeceficDayMessage: any[];

  constructor(public service: AppService) {
    this.listSpeceficDayMessage = [];
  }

  ngOnInit() {
    // this.dayInfo = JSON.parse(this.dayInfo);
    // console.log('dayInfo', this.dayInfo);

    this.service.dataMessage$.subscribe(data => {
      this.listSpeceficDayMessage = [];

      // جدا کردن پیغام های هر روز و کاربر
      this.service.listNotifyMessage.forEach(msg => {
        if (this.dayInfo.Date == msg.Date && this.dayInfo.PersonID== msg.OwnerId) {
          this.listSpeceficDayMessage.push(msg);
        }
      });
      // console.log('listSpeceficDayMessage',this.listSpeceficDayMessage , data);
    });
  }

}
