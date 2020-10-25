import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calcMovazafi'
})
export class CalcMovazafiPipe implements PipeTransform {

  transform(value: any, personId: any): any {
    var sum = 0;
    value.forEach(row => {
      if (row.PersonInfo.PersonID == personId) {
        for (const key in row.Days) {
          sum += row.Days[key].Movazafi;
        }
      }
    });
    return sum;
  } 
}
