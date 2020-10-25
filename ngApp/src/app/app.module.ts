import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
//import { HttpModule }               from '@angular/http';
import { HttpClientModule, HttpClientJsonpModule  }         from '@angular/common/http';
// Import the Animations module
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
// kendo modules
import { RTL }                      from '@progress/kendo-angular-l10n';
import { ButtonsModule }            from '@progress/kendo-angular-buttons';
import { DropDownsModule }          from '@progress/kendo-angular-dropdowns';
/* scroll */
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';



/* services */
import { ServerService }  from './server.service';
import { AppService }     from './app.service';
import { DialogService } from './Services/dialog.service';
import { StructureService } from "./Services/structure.service";
import { GlobalPopupService } from "./Services/global-popup.service";
import { CartableService } from "./Services/cartable.service";

//Components
import { AppComponent }                 from './app.component';
import { DayComponentComponent }        from './Components/day-component/day-component.component';
import { PersonelComponent }            from './Components/personel/personel.component';
import { DepartmentControlComponent }   from './Components/department-control/department-control.component';
import { TotalComponent }               from './Components/total/total.component';
import { MessageComponentComponent } from './Components/message-component/message-component.component';
import { AddNewMessageComponent } from './Components/add-new-message-component/add-new-message-component.component';
import { ConfirmComponentsComponent } from './Components/confirm-components/confirm-components.component';
import { FilterComponentComponent } from './Components/filter-component/filter-component.component';
import { MessageTooltipComponent } from './Components/message-tooltip/message-tooltip.component';

// Pipes
import { structureCountingPipe }  from './Pipes/structure-counting.pipe';
import { CalcMovazafiPipe }       from './Pipes/calc-movazafi.pipe';
import { CalcKarkerdPipe }        from './Pipes/calc-karkerd.pipe';
import { CalcEzafekarPipe }       from './Pipes/calc-ezafekar.pipe';
import { TotalOfColumnsPipe }     from './Pipes/total-of-columns.pipe';
import { SortDropdownPanelComponent } from './Components/sort-dropdown-panel/sort-dropdown-panel.component';
import { NotSeenNotifyMessagePipe } from './Pipes/not-seen-notify-message.pipe';
import { CartableComponentComponent } from './Components/cartable-component/cartable-component.component';

// Date Picker
import {DpDatePickerModule} from 'ng2-jalali-date-picker';

//Dialog
import { DialogComponent } from './Components/dialog/dialog.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};


@NgModule({
  declarations: [
    AppComponent,
    DayComponentComponent,
    PersonelComponent,
    DepartmentControlComponent,
    structureCountingPipe,
    TotalComponent,
    CalcMovazafiPipe,
    CalcKarkerdPipe,
    CalcEzafekarPipe,
    TotalOfColumnsPipe,
    SortDropdownPanelComponent,
    MessageComponentComponent,
    AddNewMessageComponent,
    ConfirmComponentsComponent,
    NotSeenNotifyMessagePipe,
    FilterComponentComponent,
    MessageTooltipComponent,
    CartableComponentComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    PerfectScrollbarModule,

    FormsModule,
    //HttpModule,
    BrowserAnimationsModule,
    ButtonsModule,
    DropDownsModule,

    DpDatePickerModule
  ],
  providers: [
    AppService, 
    ServerService,
    CartableService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { 
      provide: RTL, 
      useValue: true 
    },
    DialogService,
    StructureService,
    GlobalPopupService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
