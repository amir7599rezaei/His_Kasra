import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-add-new-message-component',
  templateUrl: './add-new-message-component.component.html',
  styleUrls: ['./add-new-message-component.component.scss']
})
export class AddNewMessageComponent implements OnInit,OnChanges {

  @Output() saveMessageSelectedCell = new EventEmitter();
  
  constructor(public service: AppService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  chooseCode(){
    this.service.showAddNewMsgComponent = false;
    this.service.chooseCellMode = true;
  }

  saveMessage(){
    this.saveMessageSelectedCell.emit();
  }

  closeAddNewMsgComponent(){
    this.service.showAddNewMsgComponent = false
    this.service.messageSelectedCell = {
      type: '',
      day: {},
      person: {},
      message: ''
    };
  }
}
