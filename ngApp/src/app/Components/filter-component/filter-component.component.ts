import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-filter-component',
  templateUrl: './filter-component.component.html',
  styleUrls: ['./filter-component.component.scss']
})
export class FilterComponentComponent implements OnInit {

  constructor(public service: AppService) {
  }
  ngOnInit() {
  }

  closeFilterComponent() {
    this.service.showFilterComponent = false;
  }

  changeCheckBox(){
    console.log('service.listAvailableFilter',this.service.listAvailableFilter);
    
  }
}
