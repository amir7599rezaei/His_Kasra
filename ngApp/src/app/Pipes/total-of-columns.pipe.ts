import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalOfColumns',
  pure: false
})
export class TotalOfColumnsPipe implements PipeTransform {

  transform(value: any, CategoryStructureID:string, dayNum:string): any {
    var num:number = 0;
    value.forEach(element => {
      element.Days[dayNum].Structures.forEach(strElement => {
        if(strElement.CategoryStructureID == CategoryStructureID){
          num++;
        }
      });
    });
    return num;
  }

}