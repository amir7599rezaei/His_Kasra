import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { StructureService } from "../../Services/structure.service";

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.scss']
})
export class TotalComponent implements OnInit {

  constructor(public service: AppService, public structureService:StructureService) { }

  ngOnInit() {
  }

  onFooterBottomCollapseBtn(event:any){
    
  }

}
